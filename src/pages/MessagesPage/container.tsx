import React, {ChangeEvent} from 'react';
import {inject, observer} from 'mobx-react';
import MessagesPageLayout from 'pages/MessagesPage/layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import moment from 'moment';
import config from 'constants/config';

interface IInjectedProps {
  account: IAccount;
  initiated: boolean;
  chats: IChat[];
  messages: IChatMessage[];
  activeChat: IChat | null;
  requestedToDeleteChats: string[];
  getChats: (id: string, isMerchant: boolean) => void;
  setActiveChat: (chatId: string) => void;
  getMessagesLoading: boolean;
  sendMessage: (message: Partial<IChatMessage>, role: UserRole) => void;
  subscribeMessages: (id: string) => void;
  updateChat: (chatId: string, data: Partial<IChat>) => Promise<void>;
  toggleDeleteModal: (value: boolean, chats?: string[]) => void;
}

interface IState {
  selectedChats: string[];
  messageType: ChatType | 'all';
  chatsSortType: 'name' | 'date';
  searchChatsMode: boolean;
  chatsSortAsc: boolean;
  showArchived: boolean;
  showChatInfo: boolean;
  textFields: ITextFieldsState;
  multiSelectFields: IMultiSelectFieldsState;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    initiated: rootStore.messagesStore.initiated,
    chats: rootStore.messagesStore.chats,
    messages: rootStore.messagesStore.messages,
    activeChat: rootStore.messagesStore.activeChat,
    getMessagesLoading: rootStore.messagesStore.getMessagesLoading,
    requestedToDeleteChats: rootStore.messagesStore.requestedToDeleteChats,
    setActiveChat: rootStore.messagesStore.setActiveChat,
    getChats: rootStore.messagesStore.getChats,
    sendMessage: rootStore.messagesStore.sendMessage,
    subscribeMessages: rootStore.messagesStore.subscribeMessages,
    updateChat: rootStore.messagesStore.updateChat,
    toggleDeleteModal: rootStore.messagesStore.toggleDeleteModal,
  }),
)
@observer
class MessagesPageContainer extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedChats: [],
      messageType: 'all',
      chatsSortType: 'name',
      chatsSortAsc: true,
      showArchived: true,
      showChatInfo: false,
      searchChatsMode: false,
      textFields: {
        dateFilter: {
          value: `${moment()
            .subtract(1, 'week')
            .format(config.COMMON.dateFormat)}${config.COMMON.dateSplitter}${moment().format(
            config.COMMON.dateFormat,
          )}`,
          error: '',
        },
        chatsQuery: {
          value: '',
          error: '',
        },
      },
      multiSelectFields: {
        locationFilter: {
          values: [],
          error: '',
        },
        groupFilter: {
          values: [],
          error: '',
        },
      },
    };
  }

  componentDidMount() {
    const isMerchant = this.props.account.role === 'MERCHANT';
    this.props.getChats(isMerchant ? '0' : '1', isMerchant);
    this.props.subscribeMessages(isMerchant ? '0' : '1');
  }

  handleSelectChat = (chatIds: string | string[]) => {
    const {selectedChats} = this.state;

    if (typeof chatIds === 'string') {
      this.setState({
        selectedChats:
          selectedChats.indexOf(chatIds) > -1
            ? selectedChats.filter(id => id !== chatIds)
            : [...selectedChats, chatIds],
      });
    } else {
      this.setState({
        selectedChats: chatIds.every(chatId => selectedChats.indexOf(chatId) > -1) ? [] : chatIds,
      });
    }
  };

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    const {textFields} = this.state;
    const {name, value} = e.target;

    this.setState({
      textFields: {
        ...textFields,
        [name]: {
          value: value,
          error: '',
        },
      },
      selectedChats: [],
    });
  };

  handleChangeMultiselectField = (name: string, values: string[]) => {
    this.setState({
      multiSelectFields: {
        ...this.state.multiSelectFields,
        [name]: {
          values,
          error: '',
        },
      },
      selectedChats: [],
    });
  };

  handleChangeMessageType = (messageType: ChatType | 'all') => {
    this.setState({
      messageType,
      selectedChats: [],
    });
  };

  handleSendMessage = (text: string) => {
    if (!this.props.activeChat || !text) return;
    const {activeChat, account} = this.props;

    this.props.sendMessage({
      chatId: activeChat.id,
      recipientId: this.props.account.role === 'MERCHANT' ? activeChat.customerId : activeChat.merchantId,
      senderId: this.props.account.role === 'MERCHANT' ? activeChat.merchantId : activeChat.customerId,
      text,
    }, account.role);
  };

  handleToggleArchived = () => {
    this.setState({
      showArchived: !this.state.showArchived,
      selectedChats: [],
    });
  };

  handleDateChange = (name: string, value: string) => {
    const {textFields} = this.state;

    this.setState({
      textFields: {
        ...textFields,
        [name]: {
          value,
          error: textFields[name].error,
        },
      },
      selectedChats: [],
    });
  };

  handleArchiveChats = async (chatIds: string[], isArchived: boolean) => {
    await Promise.all(chatIds.map(chatId => this.props.updateChat(chatId, {isArchived})));
  };

  handleDeleteChats = async (chatIds: string[]) => {
    this.props.toggleDeleteModal(true, chatIds);
  };

  handleToggleChatInfo = () => {
    this.setState({showChatInfo: !this.state.showChatInfo});
  };

  handleSetSearchMode = (searchChatsMode: boolean) => {
    this.setState({
      searchChatsMode,
      textFields: {
        ...this.state.textFields,
        chatsQuery: {
          value: '',
          error: '',
        },
      },
    });
  };

  handleChangeSort = (chatsSortType: 'name' | 'date') => {
    this.setState({
      chatsSortType,
      chatsSortAsc: this.state.chatsSortType === chatsSortType ? !this.state.chatsSortAsc : true,
    });
  };

  render() {
    return (
      <MessagesPageLayout
        t={this.props.t}
        initiated={this.props.initiated}
        chats={this.props.chats}
        messages={this.props.messages}
        getMessagesLoading={this.props.getMessagesLoading}
        activeChat={this.props.activeChat}
        selectedChats={this.state.selectedChats}
        chatType={this.state.messageType}
        chatsSortType={this.state.chatsSortType}
        chatsSortAsc={this.state.chatsSortAsc}
        textFields={this.state.textFields}
        multiSelectFields={this.state.multiSelectFields}
        showArchived={this.state.showArchived}
        showChatInfo={this.state.showChatInfo}
        searchChatsMode={this.state.searchChatsMode}
        customerMode={this.props.account.role === 'CUSTOMER'}
        onToggleChatInfo={this.handleToggleChatInfo}
        setActiveChat={this.props.setActiveChat}
        onSelectChat={this.handleSelectChat}
        onChangeMultiselectField={this.handleChangeMultiselectField}
        onChangeMessageType={this.handleChangeMessageType}
        onSendMessage={this.handleSendMessage}
        onToggleArchived={this.handleToggleArchived}
        onDateChange={this.handleDateChange}
        onArchiveChats={this.handleArchiveChats}
        onDeleteChats={this.handleDeleteChats}
        onSetSearchMode={this.handleSetSearchMode}
        onChangeTextField={this.handleChangeTextField}
        onChangeSort={this.handleChangeSort}
      />
    );
  }
}

const MessagesPage = enhance(MessagesPageContainer, [withTranslation()]);
export default MessagesPage;
