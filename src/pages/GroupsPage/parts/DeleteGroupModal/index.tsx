import React from 'react';
import styles from 'pages/GroupsPage/parts/DeleteGroupModal/styles.module.scss';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import MessageBox from 'components/MessageBox';

interface IInjectedProps {
  deleteModalIsActive: boolean;
  deleteGroupError: string;
  deleteGroupLoading: boolean;
  chosenGroups: string[];
  deleteGroup: () => void;
  toggleDeleteModal: (value: boolean) => void;
  groups: IGroup[];
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  deleteModalIsActive: rootStore.groupsStore.deleteModalIsActive,
  deleteGroupError: rootStore.groupsStore.deleteGroupError,
  deleteGroupLoading: rootStore.groupsStore.deleteGroupLoading,
  chosenGroups: rootStore.groupsStore.chosenGroups,
  toggleDeleteModal: rootStore.groupsStore.toggleDeleteModal,
  deleteGroup: rootStore.groupsStore.deleteGroups,
  groups: rootStore.groupsStore.groups,
}))
@observer
class DeleteGroupModalBase extends React.Component<IInjectedProps & WithTranslation> {
  handleClose = () => {
    if (this.props.deleteGroupLoading) return;
    this.props.toggleDeleteModal(false);
  };

  render() {
    const {
      t,
      deleteModalIsActive,
      deleteGroupError,
      deleteGroupLoading,
      deleteGroup,
      chosenGroups,
      groups,
    } = this.props;

    if (!deleteModalIsActive) return null;

    const getMessage = () => {
      return chosenGroups.reduce((acc, groupId, i) => {
        const name = groups.find(group => group.id === groupId)?.name;
        return acc + (i > 0 ? `, ` : '') + name;
      }, '');
    };

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
        <Button className={styles.btn} onClick={deleteGroup} disabled={deleteGroupLoading} loading={deleteGroupLoading}>
          {t('Yes, delete')}
        </Button>
        {deleteGroupError && (
          <MessageBox className={styles.message} type="danger">
            {deleteGroupError}
          </MessageBox>
        )}
      </Modal>
    );
  }
}

const DeleteGroupModal = enhance(DeleteGroupModalBase, [withTranslation()]);
export default DeleteGroupModal;
