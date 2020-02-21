import React, {ChangeEvent} from 'react';
import styles from 'pages/LocationsPage/parts/CreateLocationModal/styles.module.scss';
import Icon from 'components/Icon';
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import {ICreateLocationRequestData} from 'services/LocationsService';

interface IInjectedProps {
  account: IAccount;
  createModalIsActive: boolean;
  createLocationLoading: boolean;
  createLocation: (data: ICreateLocationRequestData) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
}

interface IState {
  textFields: ITextFieldsState;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  account: rootStore.authStore.account!,
  createModalIsActive: rootStore.locationsStore.createModalIsActive,
  toggleCreateModal: rootStore.locationsStore.toggleCreateModal,
  createLocationLoading: rootStore.locationsStore.createLocationLoading,
  createLocation: rootStore.locationsStore.createLocation,
}))
@observer
class CreateLocationModalBase extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      textFields: {
        locationName: {
          value: '',
          error: '',
        },
      },
    };
  }

  handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
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
    });
  };

  handleClose = () => {
    const {createLocationLoading, toggleCreateModal} = this.props;
    if (createLocationLoading) return;
    toggleCreateModal(false);
  };

  handleCreate = async () => {
    const {account} = this.props;
    const {locationName} = this.state.textFields;

    await this.props.createLocation({
      name: locationName.value,
      businessId: account.businessId,
    });

    this.setState({
      textFields: {
        locationName: {
          value: '',
          error: '',
        },
      },
    });
  };

  render() {
    const {t, createModalIsActive, createLocationLoading} = this.props;
    const {locationName} = this.state.textFields;

    return (
      <Modal className={styles.box} visible={createModalIsActive} onClose={this.handleClose}>
        <div className={styles.topCircle}>
          <Icon name="pin" />
        </div>
        <span className={styles.title}>{t('Add new location')}</span>
        <span className={styles.sub}>{t('Enter location name')}</span>
        <Input name="locationName" type="text" value={locationName.value} onChange={this.handleChangeField} />
        <Button
          className={styles.btn}
          onClick={this.handleCreate}
          disabled={createLocationLoading}
          loading={createLocationLoading}
        >
          {t('Add Location')}
        </Button>
      </Modal>
    );
  }
}

const CreateLocationModal = enhance(CreateLocationModalBase, [withTranslation()]);
export default CreateLocationModal;
