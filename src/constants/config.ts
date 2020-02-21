const DEV = {
  API: {
    URL: 'https://europe-west1-develop-engage-260115.cloudfunctions.net',
  },
  DEBUG: true,
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyCPLGnjSjSfvFlh6Iu89d5wruIR6EbJsE0',
    authDomain: 'develop-engage-260115.firebaseapp.com',
    databaseURL: 'https://develop-engage-260115.firebaseio.com',
    projectId: 'develop-engage-260115',
    storageBucket: 'develop-engage-260115.appspot.com',
    messagingSenderId: '421882892523',
    appId: '1:421882892523:web:c5ac95fe835f4f4cfc6eae',
    measurementId: 'G-GNMRY4TX6Z',
  },
};

const STAGE = {
  API: {
    URL: 'https://europe-west1-stage-engage.cloudfunctions.net',
  },
  DEBUG: false,
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyAxvT_3SlrtIBVDBodyGCWceaq_VquW8lA',
    projectId: 'stage-engage',
    appId: '1:703193532520:web:f2112dd244c5d88d7753dd',
  },
};

const config = {
  ...(process.env.REACT_APP_ENV === 'development' ? DEV : STAGE),
  TEST_USER: {
    email: 'merchant@mail.com',
    password: 'secret1!A',
  },
  SMARTY_STREETS_CONFIG: {
    suggestUrl: 'https://us-autocomplete.api.smartystreets.com/suggest',
    validateUrl: 'https://us-street.api.smartystreets.com/street-address',
    authId: '28527993004609857',
  },
  INTERCOM: {
    appId: 'r6dhy0ie',
  },
  FILES: {
    validTypes: ['image/png', 'image/jpeg'],
    maxSize: 10485760,
  },
  CHAT: {
    chatsPerPage: 30,
    messagesPerPage: 50,
  },
  COMMON: {
    appRootId: 'engage-root',
    extensionGlobalKey: '__ENGAGE__EXTENSION__ENABLED__',
    itemsPerPage: 50,
    dateSplitter: ' - ',
    dateFormat: 'MMM D, YYYY',
    merchantBodyClass: 'engage-merchant-app',
    customerBodyClass: 'engage-customer-app',
  },
  FIRESTORE: {
    table: {
      chats: 'chats',
      customerMerchant: 'customer_merchant',
      messages: 'messages',
      zipCodes: 'zip_codes',
    },
  },
  EXTENSION: {
    rewardHeight: 185,
    rewardVerticalMargin: 12,
    rewardRenderOutOfScreenOffset: 100,
  },
  BANKS: {
    capitalOne: {
      transactionContainer: '#recent-transaction',
      transaction: '[id^=recent-postedTransaction]',
      merchantName:  '[id^=recent-transaction-description-prefix-text]',
    },
    americanExpress: {
      transactionContainer: '[data-module-name=axp-activity-feed-no-receipt-container] .margin-b.dls-accent-white-01-bg.shadow-1',
      transaction: '.position-relative',
      merchantName: '.col-md-4.col-sm-8.pad-responsive-lr.pad-1-t-sm-down p'
    }
  }
};

console.log(`%c REACT_APP_ENV = ${process.env.REACT_APP_ENV}`, 'color: green; font-size: 20px;');

export default config;
