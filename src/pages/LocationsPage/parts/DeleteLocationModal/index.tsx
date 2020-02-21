import React from 'react';
import styles from 'pages/LocationsPage/parts/DeleteLocationModal/styles.module.scss';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';

interface IInjectedProps {
  locations: ILocation[];
  deleteModalIsActive: boolean;
  deleteLocationLoading: boolean;
  requestedToDeleteLocations: string[];
  deleteLocations: () => void;
  toggleDeleteModal: (value: boolean) => void;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  deleteModalIsActive: rootStore.locationsStore.deleteModalIsActive,
  deleteLocationLoading: rootStore.locationsStore.deleteLocationLoading,
  locations: rootStore.locationsStore.locations,
  requestedToDeleteLocations: rootStore.locationsStore.requestedToDeleteLocations,
  toggleDeleteModal: rootStore.locationsStore.toggleDeleteModal,
  deleteLocations: rootStore.locationsStore.deleteLocations,
}))
@observer
class DeleteLocationModalBase extends React.Component<IInjectedProps & WithTranslation> {
  handleClose = () => {
    const {deleteLocationLoading, toggleDeleteModal} = this.props;
    if (deleteLocationLoading) return;
    toggleDeleteModal(false);
  };

  render() {
    const {
      t,
      deleteModalIsActive,
      deleteLocationLoading,
      deleteLocations,
      locations,
      requestedToDeleteLocations,
    } = this.props;

    if (!deleteModalIsActive) return null;
    const getMessage = () => {
      console.log({requestedToDeleteLocations});
      return requestedToDeleteLocations.reduce((acc, rewardId, i) => {
        const name = locations.find(reward => reward.id === rewardId)?.name;
        return acc + (i > 0 ? `, ` : '') + name;
      }, '');
    };

    return (
      <Modal className={styles.box} visible onClose={this.handleClose}>
        <div className={styles.topCircle}>!</div>
        <span className={styles.title}>{t('Delete Locations')}</span>
        <span className={styles.sub}>
          {t('Are you sure you want to delete')}
          {' "'}
          {getMessage()}
          {'"?'}
        </span>
        <Button
          className={styles.btn}
          onClick={deleteLocations}
          disabled={deleteLocationLoading}
          loading={deleteLocationLoading}
        >
          {t('Yes, delete')}
        </Button>
      </Modal>
    );
  }
}

const DeleteLocationModal = enhance(DeleteLocationModalBase, [withTranslation()]);
export default DeleteLocationModal;
