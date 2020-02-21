import React, {ChangeEvent} from 'react';
import styles from 'pages/GroupsPage/parts/CreateGroupModal/styles.module.scss';
import Icon from 'components/Icon';
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import MessageBox from 'components/MessageBox';
import {defaultGroupFilters} from 'constants/defaultGroupFilters';

interface IInjectedProps {
  account: IAccount;
  createModalIsActive: boolean;
  createGroupError: string;
  createGroupLoading: boolean;
  createGroup: (data: IGroupCreateRequestData) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
  groups: IGroup[];
}

interface IState {
  textFields: ITextFieldsState;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  account: rootStore.authStore.account!,
  createModalIsActive: rootStore.groupsStore.createModalIsActive,
  toggleCreateModal: rootStore.groupsStore.toggleCreateModal,
  createGroupError: rootStore.groupsStore.createGroupError,
  createGroupLoading: rootStore.groupsStore.createGroupLoading,
  createGroup: rootStore.groupsStore.createGroup,
  groups: rootStore.groupsStore.groups,
}))
@observer
class CreateGroupModalBase extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      textFields: {
        groupName: {
          value: '',
          error: '',
        },
      },
    };
  }

  handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      textFields: {
        ...this.state.textFields,
        [e.target.name]: {
          value: e.target.value,
          error: '',
        },
      },
    });
  };

  handleClose = () => {
    const {createGroupLoading, toggleCreateModal} = this.props;
    if (createGroupLoading) return;
    toggleCreateModal(false);
  };

  getGroupPriority = (numb: number): number => {
    if (this.props.groups.some(group => group.priority === numb)) {
      return this.getGroupPriority(++numb);
    }
    return numb;
  };

  handleCreate = async () => {
    await this.props.createGroup({
      name: this.state.textFields.groupName.value,
      businessId: this.props.account.businessId,
      priority: this.getGroupPriority(1),
      filters: defaultGroupFilters,
    });

    this.setState({
      textFields: {
        groupName: {
          value: '',
          error: '',
        },
      },
    });
  };

  render() {
    const {t, createModalIsActive, createGroupError, createGroupLoading} = this.props;
    const {groupName} = this.state.textFields;

    return (
      <Modal className={styles.box} visible={createModalIsActive} onClose={this.handleClose}>
        <div className={styles.topCircle}>
          <Icon name="pin" />
        </div>
        <span className={styles.title}>{t('Add new group')}</span>
        <span className={styles.sub}>{t('Enter group name')}</span>
        <Input name="groupName" type="text" value={groupName.value} onChange={this.handleChangeField} />
        <Button
          className={styles.btn}
          onClick={this.handleCreate}
          disabled={createGroupLoading}
          loading={createGroupLoading}
        >
          {t('Add Group')}
        </Button>
        {createGroupError && (
          <MessageBox className={styles.message} type="danger">
            {createGroupError}
          </MessageBox>
        )}
      </Modal>
    );
  }
}

const CreateGroupModal = enhance(CreateGroupModalBase, [withTranslation()]);
export default CreateGroupModal;
