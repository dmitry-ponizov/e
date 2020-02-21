import React from 'react';
import styles from 'pages/GroupsPage/parts/DeleteGroupModal/styles.module.scss';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';

interface IInjectedProps {
  deleteModalIsActive: boolean;
  requestedToDeleteChats: string[];
  chats: IChat[];
  updateChat: (chatId: string, data: Partial<IChat>) => Promise<void>;
  toggleDeleteModal: (value: boolean, chatIds?: string[]) => void;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  deleteModalIsActive: rootStore.messagesStore.deleteModalIsActive,
  requestedToDeleteChats: rootStore.messagesStore.requestedToDeleteChats,
  chats: rootStore.messagesStore.chats,
  updateChat: rootStore.messagesStore.updateChat,
  toggleDeleteModal: rootStore.messagesStore.toggleDeleteModal,
}))
@observer
class DeleteChatsModalBase extends React.Component<IInjectedProps & WithTranslation> {
  handleClose = () => this.props.toggleDeleteModal(false);

  handleConfirmDeleteChats = async () => {
    this.props.requestedToDeleteChats.forEach(chatId => this.props.updateChat(chatId, {isDeleted: true}));
    this.props.toggleDeleteModal(false, []);
  };

  render() {
    const {t, deleteModalIsActive, chats, requestedToDeleteChats} = this.props;

    if (!deleteModalIsActive) return null;

    const getMessage = () => {
      return requestedToDeleteChats.reduce((acc, chatId, i) => {
        const name = chats.find(chat => chat.id === chatId)?.customerId;
        return [...acc, i > 0 ? t(` and `) : '', 'Customer ID ', <strong key={chatId}>#{name}</strong>];
      }, []);
    };

    return (
      <Modal className={styles.box} visible onClose={this.handleClose}>
        <div className={styles.topCircle}>!</div>
        <span className={styles.title}>{t('Delete Chats')}</span>
        <span className={styles.sub}>
          {t('Permanently delete chats with ')}
          {getMessage()}
          {'?'}
          <br />
          {t("You can't undo this.")}
        </span>
        <Button className={styles.btn} onClick={this.handleConfirmDeleteChats}>
          {t('Yes, delete')}
        </Button>
      </Modal>
    );
  }
}

const DeleteChatsModal = enhance(DeleteChatsModalBase, [withTranslation()]);
export default DeleteChatsModal;
