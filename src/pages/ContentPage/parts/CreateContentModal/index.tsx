import React, {ChangeEvent} from 'react';
import styles from 'pages/LocationsPage/parts/CreateLocationModal/styles.module.scss';
import Icon from 'components/Icon';
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {withTranslation} from 'react-i18next';
import SelectHOC from 'components/SelectHOC';
import MultiSelect from 'components/MultiSelect';
import LocationsService from 'services/LocationsService';
import GroupsService from 'services/GroupsService';
import config from 'constants/config';
import {TFunction} from 'i18next';

interface IProps {
  t: TFunction;
}

interface IInjectedProps {
  account: IAccount;
  createModalIsActive: boolean;
  createContentItemLoading: boolean;
  createContentItem: (data: Partial<IContentItemDetails>) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
  selectedContentItemDetails: IContentItemDetails;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  multiSelectFields: IMultiSelectFieldsState;
  contentInitialGroups: IOption[];
  isLogoEnabled: boolean;
  exitModalIsOpen: boolean;
  hasChanges: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    createModalIsActive: rootStore.contentStore.createModalIsActive,
    toggleCreateModal: rootStore.contentStore.toggleCreateModal,
    createContentItemLoading: rootStore.contentStore.createContentItemLoading,
    createContentItem: rootStore.contentStore.createContentItem,
    selectedContentItemDetails: rootStore.contentStore.selectedContentItemDetails!,
  }),
)
@observer
class CreateLocationModalBase extends React.Component<IProps & IInjectedProps, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = (): IState => {
    const {location, groups} = this.props.selectedContentItemDetails;
    return {
      textFields: {
        contentItemName: {
          value: '',
          error: '',
        },
      },
      selectFields: {
        location: {
          value: {value: location.id, label: location.name!},
          error: '',
        },
      },
      multiSelectFields: {
        groups: {
          values: groups.map(group => group.id),
          error: '',
        },
      },
      contentInitialGroups: groups.map(group => ({value: group.id, label: group.name!})),
      hasChanges: false,
      exitModalIsOpen: false,
      isLogoEnabled: true,
    };
  };

  onLoadLocations = async (searchQuery, loadedOptions) => {
    const transport = await LocationsService.getLocations({
      offset: loadedOptions.length,
      per_page: config.COMMON.itemsPerPage,
      filter: searchQuery.length ? searchQuery : null,
    });

    if (!transport.success) {
      return {
        options: [],
        hasMore: false,
      };
    }

    const locations: IOption[] = transport.response.data.data.map(location => {
      return {value: location.id, label: location.name};
    });

    return {
      options: locations,
      hasMore: locations.length === config.COMMON.itemsPerPage,
    };
  };

  onLoadGroups = async loadedOptions => {
    const transport = await GroupsService.getGroups({
      offset: loadedOptions.length,
      per_page: config.COMMON.itemsPerPage,
      filter: this.state.contentInitialGroups.map(group => `id||ne||${group.value}`),
    });

    if (!transport.success) {
      return {
        items: [],
        hasMore: false,
      };
    }

    const groups: IOption[] = transport.response.data.data.map(group => ({
      value: group.id,
      label: group.name,
    }));

    return {
      items: groups,
      hasMore: groups.length === config.COMMON.itemsPerPage,
    };
  };

  handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
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

  handleChangeSelect = (name: string, value: IOption) => {
    this.setState({
      selectFields: {
        [name]: {
          value,
          error: '',
        },
      },
    });
  };

  handleChangeMultiSelect = (name: string, value: string[]) => {
    this.setState({
      multiSelectFields: {
        [name]: {
          values: value,
          error: '',
        },
      },
    });
  };

  handleClose = () => {
    if (this.props.createContentItemLoading) return;
    this.props.toggleCreateModal(false);
  };

  handleCreate = async () => {
    await this.props.createContentItem({
      name: this.state.textFields.contentItemName.value,
      groups: this.state.multiSelectFields.groups.values.map(group => ({id: group})),
      location: {id: this.state.selectFields.location.value!.value},
      isLogoEnabled: true,
    });

    this.setState({
      textFields: {
        contentItemName: {
          value: '',
          error: '',
        },
      },
      multiSelectFields: {
        groups: {
          values: [],
          error: '',
        },
      },
    });
  };

  render() {
    const {textFields, selectFields, multiSelectFields, contentInitialGroups} = this.state;
    const {t, createModalIsActive, createContentItemLoading} = this.props;

    return (
      <Modal className={styles.box} visible={createModalIsActive} onClose={this.handleClose}>
        <div className={styles.topCircle}>
          <Icon name="pencil" />
        </div>
        <span className={styles.title}>{t('Add new content item')}</span>
        <span className={styles.sub}>{t('Enter item name')}</span>
        <Input
          name="contentItemName"
          type="text"
          value={textFields.contentItemName.value}
          onChange={this.handleChangeText}
        />
        <SelectHOC
          label={t('Location')}
          error={selectFields.location.error}
          zIndex={10}
          baseSelectProps={{
            name: 'location',
            value: selectFields.location.value,
            onChange: this.handleChangeSelect,
          }}
          asyncSelectProps={{
            loadOptions: this.onLoadLocations,
            debounceTimeout: 500,
          }}
        />
        <MultiSelect
          t={t}
          label={t('Groups')}
          description={`${t('Select groups')}:`}
          name={'groups'}
          selected={multiSelectFields.groups.values}
          options={contentInitialGroups}
          onChange={this.handleChangeMultiSelect}
          // getItemsAsync={this.onLoadGroups}
        />
        <Button
          className={styles.btn}
          onClick={this.handleCreate}
          disabled={createContentItemLoading}
          loading={createContentItemLoading}
        >
          {t('Add new content item')}
        </Button>
      </Modal>
    );
  }
}

const CreateLocationModal = enhance(CreateLocationModalBase, [withTranslation()]);
export default CreateLocationModal;
