import React from 'react';
import styles from 'pages/RewardsPage/parts/DeleteRewardModal/styles.module.scss';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import MessageBox from 'components/MessageBox';

interface IInjectedProps {
  deleteModalIsActive: boolean;
  deleteRewardError: string;
  deleteRewardLoading: boolean;
  chosenRewards: string [];
  rewards: IReward[];
  deleteReward: () => void;
  toggleDeleteModal: (value: boolean) => void;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  deleteModalIsActive: rootStore.rewardsStore.deleteModalIsActive,
  deleteRewardError: rootStore.rewardsStore.deleteRewardError,
  deleteRewardLoading: rootStore.rewardsStore.deleteRewardLoading,
  rewards: rootStore.rewardsStore.rewards,
  chosenRewards: rootStore.rewardsStore.chosenRewards,
  toggleDeleteModal: rootStore.rewardsStore.toggleDeleteModal,
  deleteReward: rootStore.rewardsStore.deleteRewards,
}))
@observer
class DeleteRewardModalBase extends React.Component<IInjectedProps & WithTranslation> {
  handleClose = () => {
    const {deleteRewardLoading, toggleDeleteModal} = this.props;
    if (deleteRewardLoading) return;
    toggleDeleteModal(false);
  };

  render() {
    const {
      t,
      deleteModalIsActive,
      deleteRewardError,
      deleteRewardLoading,
      deleteReward,
      chosenRewards,
      rewards,
    } = this.props;

    if (!deleteModalIsActive) return null;
    const getMessage = () => {
      return chosenRewards.reduce((acc, rewardId, i) => {
        const name = rewards.find(reward => reward.id === rewardId)?.name;
        return acc + (i > 0 ? `, ` : '') + name;
      }, '');
    };

    return (
      <Modal className={styles.box} visible onClose={this.handleClose}>
        <div className={styles.topCircle}>i</div>
        <span className={styles.title}>{t('Delete Reward')}</span>
        <span className={styles.sub}>
          {t('Are you sure you want to delete ')}
          {getMessage()}
          {'?'}
        </span>
        <Button
          className={styles.btn}
          onClick={deleteReward}
          disabled={deleteRewardLoading}
          loading={deleteRewardLoading}
        >
          {t('Yes, delete')}
        </Button>
        {deleteRewardError && (
          <MessageBox className={styles.message} type="danger">
            {deleteRewardError}
          </MessageBox>
        )}
      </Modal>
    );
  }
}

const DeleteRewardModal = enhance(DeleteRewardModalBase, [withTranslation()]);
export default DeleteRewardModal;
