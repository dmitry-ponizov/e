import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from 'constants/config';

export interface IFirestoreTransportResponse {
  success: boolean;
  message: string;
  data: any;
  cursor: string | null;
}

type Listener = null | (() => void);

interface IListeners {
  chat: Listener;
  messageInbox: Listener;
  messageOutbox: Listener;
}

class FirebaseClass {
  constructor() {
    firebase.initializeApp(config.FIREBASE_CONFIG);
    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
  }

  auth: firebase.auth.Auth;
  firestore: firebase.firestore.Firestore;
  listeners: IListeners = {
    chat: null,
    messageInbox: null,
    messageOutbox: null,
  };

  // AUTH -------------------------------------------------------------------------------------------------------------/
  signIn = async (email, password): Promise<firebase.auth.UserCredential> => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  signOut = async (): Promise<void> => {
    return this.auth.signOut();
  };

  resetPassword = async (email): Promise<void> => {
    return this.auth.sendPasswordResetEmail(email);
  };

  setAutoLogin = async (enabled: boolean): Promise<void> => {
    await this.auth.setPersistence(
      enabled ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.NONE,
    );
  };

  getToken = async (): Promise<string> => {
    return this.auth.currentUser ? this.auth.currentUser.getIdToken() : '';
  };

  // CHAT --------------------------------------------------------------------------------------------------------/
  subscribeChats = (
    id: string,
    isMerchant: boolean,
    onReceive: (chats: IChat[]) => void,
    onError?: (error: Error) => void,
  ) => {
    if (!this.firestore || !this.auth.currentUser) return [];

    // unsubscribe
    if (this.listeners.chat) {
      this.listeners.chat();
    }

    const query = this.firestore
      .collection(config.FIRESTORE.table.chats)
      .where(isMerchant ? 'merchantId' : 'customerId', '==', id)
      .where('isDeleted', '==', false);

    // subscribe
    this.listeners.chat = query.onSnapshot(snapshot => {
      onReceive(
        snapshot.docChanges().reduce((acc, change) => {
          return [
            ...acc,
            {
              id: change.doc.id,
              ...(change.doc.data() as IChat),
            },
          ];
        }, [] as IChat[]),
      );
    }, onError);
  };

  updateChat = (chatId, data: Partial<IChat>, updateTime?: boolean) => {
    const chat: any = {
      ...data,
    };
    if (updateTime) {
      chat.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    }
    return this.firestore
      .collection(config.FIRESTORE.table.chats)
      .doc(chatId)
      .set(chat, {merge: true});
  };

  // MESSAGES ---------------------------------------------------------------------------------------------------------/
  getMessagesFromChat = (chatId: string, cursor?: string | null): Promise<IFirestoreTransportResponse> => {
    let query = this.firestore
      .collection(config.FIRESTORE.table.messages)
      .where('chatId', '==', chatId)
      .orderBy('timestamp', 'desc');

    if (cursor) {
      query = query.startAfter(cursor);
    }

    return query
      .limit(config.COMMON.itemsPerPage)
      .get()
      .then(snapshots => {
        const messages: any[] = [];
        snapshots.forEach(doc => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return {
          success: true,
          message: '',
          data: messages,
          cursor: snapshots.docs.length ? snapshots.docs[snapshots.docs.length - 1].id : null,
        };
      })
      .catch(error => {
        return {
          success: false,
          message: error.message,
          data: [],
          cursor: null,
        };
      });
  };

  subscribeMessages = (id: string, onReceive: (chats: IChatMessage[]) => void, onError?: (error: Error) => void) => {
    if (!this.firestore || !this.auth.currentUser) return;

    // unsubscribe
    if (this.listeners.messageInbox) {
      this.listeners.messageInbox();
    }
    if (this.listeners.messageOutbox) {
      this.listeners.messageOutbox();
    }

    const queryOutbox = this.firestore
      .collection(config.FIRESTORE.table.messages)
      .where('senderId', '==', '0')
      .orderBy('timestamp', 'desc');
    const queryInbox = this.firestore
      .collection(config.FIRESTORE.table.messages)
      .where('recipientId', '==', '0')
      .orderBy('timestamp', 'desc');

    const cb = (snapshot: firebase.firestore.QuerySnapshot) => {
      onReceive(
        snapshot.docChanges().reduce((acc, change) => {
          return [
            ...acc,
            {
              id: change.doc.id,
              ...(change.doc.data() as IChatMessage),
            },
          ];
        }, [] as IChatMessage[]),
      );
    };

    // subscribe
    this.listeners.messageInbox = queryOutbox.onSnapshot(cb, onError);
    this.listeners.messageOutbox = queryInbox.onSnapshot(cb, onError);
  };

  sendMessage = (activeChatId: string, message: Partial<IChatMessage>, role: UserRole) => {
    const merchantId = role === 'MERCHANT' ? message.senderId : message.recipientId;
    const customerId = role === 'CUSTOMER' ? message.senderId : message.recipientId;

    const merchantCustomerDocRef = this.firestore
      .collection(config.FIRESTORE.table.customerMerchant)
      .doc(`${merchantId}_${customerId}`);

    const merchantCustomerDoc = {
      customerId,
      merchantId,
      totalMessages: firebase.firestore.FieldValue.increment(1),
      lastMessage: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return Promise.all([
      // add message
      this.firestore.collection(config.FIRESTORE.table.messages).add({
        ...message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }),
      // update merchantCustomer
      this.firestore.runTransaction(transaction => {
        // get old Doc
        return transaction.get(merchantCustomerDocRef).then(sfDoc => {
          // create doc if not exist
          if (!sfDoc.exists) {
            return this.firestore
              .collection(config.FIRESTORE.table.customerMerchant)
              .doc(`${merchantId}_${customerId}`)
              .set(merchantCustomerDoc);
          }
          // update doc
          transaction.update(merchantCustomerDocRef, merchantCustomerDoc);
        });
      }),
      // update chat timestamp
      this.updateChat(activeChatId, {}, true),
    ]);
  };

  getZipCodes = (states: string[], cursor?: string | null): Promise<IFirestoreTransportResponse> => {
    let query = firebase
      .firestore() // select table
      .collection(config.FIRESTORE.table.zipCodes)
      // check for zip state
      .where('state', 'in', states)
      // sort by ID
      .orderBy(firebase.firestore.FieldPath.documentId())
      // get 1 page only
      .limit(config.COMMON.itemsPerPage);

    if (cursor) {
      query = query.startAfter(cursor);
    }

    return (
      query
        // run query
        .get()
        // receive response
        .then(snapshots => {
          // format data
          const zipCodes: IOption[] = [];
          snapshots.forEach(doc => {
            zipCodes.push({
              value: doc.id,
              label: doc.id,
            });
          });
          // RESULT
          return {
            success: true,
            message: '',
            data: zipCodes,
            cursor: snapshots.docs.length ? snapshots.docs[snapshots.docs.length - 1].id : null,
          };
        })
        .catch(error => {
          // RESULT
          return {
            success: false,
            message: error.message,
            data: [],
            cursor: null,
          };
        })
    );
  };
}
const Firebase = new FirebaseClass();
export default Firebase;
