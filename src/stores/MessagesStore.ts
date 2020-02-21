import {action, observable} from 'mobx';
import Firebase from 'services/firebase';
import Toast from 'components/Toast';
import {chatsAdapterIn, messagesAdapterIn} from 'helpers/adapters/messages';
import mergeArrays from 'helpers/arrayMerge';

export class MessagesStore {
  @observable
  initiated = false;
  @observable
  chats: IChat[] = [];
  @observable
  messages: IChatMessage[] = [];
  @observable
  activeChat: IChat | null = null;
  @observable
  selectedChats: string[] = [];

  // MODALS -----------------------------------------------------------------------------------------------------------/
  requestedToDeleteChats: string[] = [];
  @observable
  deleteModalIsActive = false;
  @action
  toggleDeleteModal = (value: boolean, chatIds?: string[]) => {
    if (chatIds) {
      this.requestedToDeleteChats = chatIds;
    }
    this.deleteModalIsActive = value;
  };

  // CHATS ------------------------------------------------------------------------------------------------------------/
  @observable
  getChatsLoading = false;
  @action
  getChatsStart = () => {
    this.chats = [];
    this.getChatsLoading = true;
  };
  getChats = (id: string, isMerchant: boolean) => {
    this.getChatsStart();
    Firebase.subscribeChats(id, isMerchant, this.onReceiveChats, error => Toast.show(error.message, {type: 'danger'}));
  };

  @action
  setActiveChat = (chatId: string) => {
    this.activeChat = this.chats.find(chat => chat.id === chatId)!;
    this.messages = [];
    this.getMessagesFromChat(chatId).catch(error => Toast.show(error.message, {type: 'danger'}));
  };

  chatsToDelete: string[] = [];
  @action
  onReceiveChats = (chats: any) => {
    this.getChatsLoading = false;
    this.initiated = true;

    const updatedChats: any[] = [];
    const deletedChats: string[] = [];

    chats.forEach(chat => {
      // if chat was deleted
      if (this.chatsToDelete.indexOf(chat.id) > -1) {
        // confirm deletion
        this.chatsToDelete = this.chatsToDelete.filter(chatId => chatId !== chat.id);
        deletedChats.push(chat.id);
        Toast.show(`${chat.id} has been DELETED.`, {type: 'warning'});
        return;
      }
      // check for has timestamp
      if (chat.timestamp) {
        updatedChats.push(chat);
        Toast.show(`${chat.id} has been UPDATED.`, {type: 'warning'});
      }
    });

    // if has active
    if (this.activeChat) {
      // if deleted
      if (deletedChats.indexOf(this.activeChat.id) > -1) {
        this.activeChat = null;
      }
      // if updated
      const findActive = updatedChats.find(chat => chat.id === this.activeChat?.id);
      // delete or update active chat
      if (findActive) {
        this.activeChat = chatsAdapterIn([findActive])[0];
      }
    }

    this.chats = mergeArrays(
      // filter deleted from main collection
      this.chats.filter(chat => deletedChats.indexOf(chat.id) === -1),
      // apply updates
      chatsAdapterIn(updatedChats),
      // compare by id
      (oldItem, newItem) => oldItem.id === newItem.id,
    );

    if (this.activeChat || this.chats.length === 0) return;
    this.setActiveChat(this.chats[0].id);
  };

  updateChat = async (chatId: string, data: Partial<IChat>): Promise<void> => {
    if (data.isDeleted) {
      this.chatsToDelete.push(chatId);
    }
    await Firebase.updateChat(chatId, data);
  };

  // MESSAGES ---------------------------------------------------------------------------------------------------------/
  @observable
  getMessagesLoading = false;
  @action
  getMessagesStart = () => {
    this.getMessagesLoading = true;
  };
  @action
  getMessagesFromChat = async (chatId: string): Promise<void> => {
    this.getMessagesStart();

    const transport = await Firebase.getMessagesFromChat(chatId);
    if (!transport.success) {
      this.getMessagesLoading = false;
      Toast.show(transport.message, {type: 'danger'});
      return;
    }

    this.addMessages(transport.data);
    Toast.show(`${transport.data.length} messages found in chat.`, {type: 'success'});
    this.getMessagesLoading = false;
  };

  addMessages = (messages: any) => {
    const filteredMessages = messages.filter(message => message.timestamp);
    if (!filteredMessages.length) return;
    this.messages = mergeArrays(
      this.messages,
      messagesAdapterIn(filteredMessages),
      (oldItem, newItem) => oldItem.id === newItem.id,
    ).sort((a, b) => a.timestamp - b.timestamp);
  };

  subscribeMessages = (id: string) => {
    this.initialSnapshot = true;
    Firebase.subscribeMessages(id, this.onReceiveMessages, error => Toast.show(error.message, {type: 'danger'}));
  };

  initialSnapshot = true;
  @action
  onReceiveMessages = messages => {
    if (this.initialSnapshot) {
      this.initialSnapshot = false;
      return;
    }
    this.addMessages(messages);
    Toast.show(`${messages.length} messages added.`, {type: 'success'});
  };

  @action
  sendMessage = async (message, role): Promise<void> => {
    if (!this.activeChat) return;
    Firebase.sendMessage(this.activeChat.id, message, role).catch(error => Toast.show(error.message, {type: 'danger'}));
  };
}

const messagesStore = new MessagesStore();
export default messagesStore;
