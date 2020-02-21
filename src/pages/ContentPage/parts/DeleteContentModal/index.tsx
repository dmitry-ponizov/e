import React from 'react';
import styles from 'pages/LocationsPage/parts/DeleteLocationModal/styles.module.scss';
import {TFunction} from 'i18next';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation} from 'react-i18next';
import MessageBox from 'components/MessageBox';

interface IProps {
  t: TFunction;
  deleteModalIsActive: boolean;
  deleteContentItemError: string;
  deleteContentItemLoading: boolean;
  chosenContentItems: string[];
  deleteContentItem: () => void;
  toggleDeleteModal: (value: boolean) => void;
  content: IContentItem[];
}

@inject((rootStore: IRootStore) => ({
  deleteModalIsActive: rootStore.contentStore.deleteModalIsActive,
  deleteContentItemError: rootStore.contentStore.deleteContentItemError,
  deleteContentItemLoading: rootStore.contentStore.deleteContentItemLoading,
  chosenContentItems: rootStore.contentStore.chosenContentItems,
  toggleDeleteModal: rootStore.contentStore.toggleDeleteModal,
  deleteContentItem: rootStore.contentStore.deleteContentItem,
  content: rootStore.contentStore.content,
}))
@observer
class DeleteContentModalBase extends React.Component<IProps> {
  handleClose = () => {
    if (this.props.deleteContentItemLoading) return;
    this.props.toggleDeleteModal(false);
  };

  render() {
    const {
      t,
      deleteModalIsActive,
      deleteContentItemError,
      deleteContentItemLoading,
      chosenContentItems,
      deleteContentItem,
      content,
    } = this.props;

    const getMessage = () => {
      return chosenContentItems.reduce((acc, contentItemId, i) => {
        const name = content.find(contentItem => contentItem.id === contentItemId)?.name;
        return acc + (i > 0 ? `, ` : '') + name;
      }, '');
    };

    if (!deleteModalIsActive) return null;

    return (
      <Modal className={styles.box} visible onClose={this.handleClose}>
        <div className={styles.topCircle}>!</div>
        <span className={styles.title}>{t('Delete Group')}</span>
        <span className={styles.sub}>
          {t('Are you sure you want to delete')}
          {' "'}
          {getMessage()}
          {'"?'}
        </span>
        <Button
          className={styles.btn}
          onClick={deleteContentItem}
          disabled={deleteContentItemLoading}
          loading={deleteContentItemLoading}
        >
          {t('Yes, delete')}
        </Button>
        {deleteContentItemError && (
          <MessageBox className={styles.message} type="danger">
            {deleteContentItemError}
          </MessageBox>
        )}
      </Modal>
    );
  }
}

const DeleteContentModal = enhance(DeleteContentModalBase, [withTranslation()]);
export default DeleteContentModal;
