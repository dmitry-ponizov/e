import React, {ChangeEvent} from 'react';
import styles from 'pages/RewardsPage/parts/CreateRewardModal/styles.module.scss';
import Icon from 'components/Icon';
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import MessageBox from 'components/MessageBox';

interface IInjectedProps {
  account: IAccount;
  createModalIsActive: boolean;
  createRewardError: string;
  createRewardLoading: boolean;
  createReward: (data: ICreateRewardRequestData) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
}

interface IState {
  textFields: ITextFieldsState;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  account: rootStore.authStore.account!,
  createModalIsActive: rootStore.rewardsStore.createModalIsActive,
  toggleCreateModal: rootStore.rewardsStore.toggleCreateModal,
  createRewardError: rootStore.rewardsStore.createRewardError,
  createRewardLoading: rootStore.rewardsStore.createRewardLoading,
  createReward: rootStore.rewardsStore.createReward,
}))
@observer
class CreateRewardModalBase extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      textFields: {
        rewardName: {
          value: '',
          error: '',
        },
      },
    };
  }

  handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    this.setState({
      textFields: {
        ...this.state.textFields,
        [name]: {
          value,
          error: '',
        },
      },
    });
  };

  handleClose = () => {
    if (this.props.createRewardLoading) return;
    this.props.toggleCreateModal(false);
  };

  handleCreate = async () => {
    await this.props.createReward({
      name: this.state.textFields.rewardName.value,
      businessId: this.props.account.businessId,
    });

    this.setState({
      textFields: {
        rewardName: {
          value: '',
          error: '',
        },
      },
    });
  };

  render() {
    const {t, createModalIsActive, createRewardError, createRewardLoading} = this.props;

    return (
      <Modal className={styles.box} visible={createModalIsActive} onClose={this.handleClose}>
        <div className={styles.topCircle}>
          <Icon name="star" />
        </div>
        <span className={styles.title}>{t('Add new program')}</span>
        <span className={styles.sub}>{t('Enter program name')}</span>
        <Input
          name="rewardName"
          type="text"
          value={this.state.textFields.rewardName.value}
          onChange={this.handleChangeField}
        />
        <Button
          className={styles.btn}
          onClick={this.handleCreate}
          disabled={createRewardLoading}
          loading={createRewardLoading}
        >
          {t('Add program')}
        </Button>
        {createRewardError && (
          <MessageBox className={styles.message} type="danger">
            {createRewardError}
          </MessageBox>
        )}
      </Modal>
    );
  }
}

const CreateRewardModal = enhance(CreateRewardModalBase, [withTranslation()]);
export default CreateRewardModal;
