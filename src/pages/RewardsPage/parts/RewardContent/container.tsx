import React, {ChangeEvent} from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import enhance from 'helpers/enhance';
import RewardContentLayout from 'pages/RewardsPage/parts/RewardContent/layout';
import LocationsService from 'services/LocationsService';
import GroupsService from 'services/GroupsService';
import config from 'constants/config';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';
import validateField from 'helpers/validator';
import VP from 'constants/validationPatterns';

interface IInjectedProps {
  selectedRewardDetails: IRewardDetails;
  toggleDeleteModal: (value: boolean, rewardsId: string[]) => void;
  updateReward: (businessId: string, data: IUpdateRewardData) => void;
  publishRewards: (data: IPublishRewardsRequestData) => void;
  deleteReward: (id: string) => void;
  clearErrors: () => void;
  updateRewardLoading: boolean;
  stopPublishRewardLoading: boolean;
  startPublishRewardLoading: boolean;
  deleteRewardLoading: boolean;
  updateRewardError: string;
  updateRewardLogo: (id: string, file: File | null) => Promise<void>;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  multiSelectFields: IMultiSelectFieldsState;
  hasChanges: boolean;
  exitModalIsOpen: boolean;
  logoIsUploaded: boolean;
  rewardInitialGroups: IOption[];
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedRewardDetails: rootStore.rewardsStore.selectedRewardDetails!,
    toggleDeleteModal: rootStore.rewardsStore.toggleDeleteModal,
    updateReward: rootStore.rewardsStore.updateReward,
    deleteReward: rootStore.rewardsStore.deleteRewards,
    publishRewards: rootStore.rewardsStore.publishRewards,
    updateRewardLogo: rootStore.rewardsStore.updateRewardLogo,
    updateRewardLoading: rootStore.rewardsStore.updateRewardLoading,
    deleteRewardLoading: rootStore.rewardsStore.deleteRewardLoading,
    startPublishRewardLoading: rootStore.rewardsStore.startPublishRewardLoading,
    stopPublishRewardLoading: rootStore.rewardsStore.stopPublishRewardLoading,
    updateRewardError: rootStore.rewardsStore.updateRewardError,
    clearErrors: rootStore.rewardsStore.clearErrors,
  }),
)
@observer
class RewardContentContainer extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedRewardDetails);
  }

  logo: File | null = null;
  locations: IRewardLocation[] | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedRewardDetails: IRewardDetails): IState => {
    const {name, dollars, points, level, reward, rules, picture, location, targetGroups} = selectedRewardDetails;

    return {
      textFields: {
        name: {
          value: name || '',
          error: '',
        },
        dollars: {
          value: dollars || '',
          error: '',
        },
        points: {
          value: points || '',
          error: '',
        },
        level: {
          value: level || '',
          error: '',
        },
        reward: {
          value: reward || '',
          error: '',
        },
        rules: {
          value: rules || '',
          error: '',
        },
        logo: {
          value: picture || '',
          error: '',
        },
      },
      selectFields: {
        location: {
          value: location
            ? {
                label: location.name,
                value: location.id,
              }
            : null,
          error: '',
        },
      },
      multiSelectFields: {
        groups: {
          values: targetGroups.map(group => group.id),
          error: '',
        },
      },
      rewardInitialGroups: targetGroups.map(group => ({
        label: group.name,
        value: group.id,
      })),
      hasChanges: false,
      exitModalIsOpen: false,
      logoIsUploaded: true,
    };
  };

  handleSave = async () => {
    if (!this.isValid()) return;
    const {name, dollars, points, level, reward, rules} = this.state.textFields;

    await this.props.updateReward(this.props.selectedRewardDetails.id, {
      locationId: this.state.selectFields.location.value?.value || '',
      groups: this.state.multiSelectFields.groups.values,
      name: name.value,
      dollars: parseInt(dollars.value, 10) || null,
      points: parseInt(points.value, 10) || null,
      level: parseInt(level.value, 10) || null,
      reward: reward.value || null,
      rules: rules.value || null,
    });

    this.setState({hasChanges: false});
  };

  handleDeleteReward = () => {
    this.props.toggleDeleteModal(true, [this.props.selectedRewardDetails.id]);
  };

  handlePublishReward = (type: string) => {
    this.props.publishRewards({
      type,
      rewardDraftIds: [this.props.selectedRewardDetails.id],
    });
  };

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    this.setState({
      textFields: {
        ...this.state.textFields,
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeNumberField = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    const {name, value} = e.target;

    if (!regex.test(value) && value !== '') return;

    this.setState({
      textFields: {
        ...this.state.textFields,
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
    });
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

  onLoadGroups = async (loadedOptions): Promise<ILoadOptionsResponse> => {
    const transport = await GroupsService.getGroups({
      offset: loadedOptions.length,
      per_page: config.COMMON.itemsPerPage,
      filter: this.state.rewardInitialGroups.map(group => `id||ne||${group.value}`),
    });

    if (!transport.success) {
      return {
        options: [],
        hasMore: false,
      };
    }

    const groups: IOption[] = transport.response.data.data.map(group => ({
      value: group.id,
      label: group.name,
    }));

    return {
      options: groups,
      hasMore: groups.length === config.COMMON.itemsPerPage,
    };
  };

  handleChangeSelect = (name: string, value: IOption) => {
    this.setState({
      selectFields: {
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeMultiselect = (name: string, value: string[]) => {
    this.setState({
      multiSelectFields: {
        [name]: {
          values: value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeLogo = (logoUrl: string, logo: File | null) => {
    if (logo && !config.FILES.validTypes.find(type => type === logo.type)) {
      URL.revokeObjectURL(logoUrl);
      return Toast.show(MESSAGES.invalidPictureType, {type: 'danger'});
    }
    if (logo && logo.size >= config.FILES.maxSize) {
      URL.revokeObjectURL(logoUrl);
      return Toast.show(MESSAGES.invalidPictureSize, {type: 'danger'});
    }

    this.setState({
      textFields: {
        ...this.state.textFields,
        logo: {
          value: logoUrl,
          error: '',
        },
      },
      logoIsUploaded: false,
      hasChanges: true,
    });
    this.logo = logo;
  };

  handleUploadLogo = async () => {
    await this.props.updateRewardLogo(this.props.selectedRewardDetails.id, this.logo);

    if (this.props.updateRewardError) return;

    this.setState({logoIsUploaded: true});
    this.logo = null;
  };

  isValid = (): boolean => {
    const {textFields} = this.state;

    const nameError = validateField(VP.reward.name, textFields.name.value);
    const dollarsError = validateField(VP.reward.dollars, textFields.dollars.value);
    const pointsError = validateField(VP.reward.points, textFields.points.value);
    const levelError = validateField(VP.reward.level, textFields.level.value);
    const rewardError = validateField(VP.reward.reward, textFields.reward.value);
    const rulesError = validateField(VP.reward.rules, textFields.rules.value);

    this.setState({
      textFields: {
        ...textFields,
        name: {
          ...textFields.name,
          error: nameError,
        },
        dollars: {
          ...textFields.dollars,
          error: dollarsError,
        },
        points: {
          ...textFields.points,
          error: pointsError,
        },
        level: {
          ...textFields.level,
          error: levelError,
        },
        reward: {
          ...textFields.reward,
          error: rewardError,
        },
        rules: {
          ...textFields.rules,
          error: rulesError,
        },
      },
    });

    return !(nameError || dollarsError || pointsError || levelError || rewardError || rulesError);
  };

  render() {
    return (
      <RewardContentLayout
        t={this.props.t}
        onUploadLogo={this.handleUploadLogo}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        multiSelectFields={this.state.multiSelectFields}
        selectedRewardDetails={this.props.selectedRewardDetails}
        hasChanges={this.state.hasChanges}
        onChangeTextField={this.handleChangeTextField}
        onChangeNumberField={this.handleChangeNumberField}
        onChangeMultiselect={this.handleChangeMultiselect}
        onSaveReward={this.handleSave}
        onDeleteReward={this.handleDeleteReward}
        onPublishReward={this.handlePublishReward}
        onChangeSelect={this.handleChangeSelect}
        onLoadLocations={this.onLoadLocations}
        onLoadGroups={this.onLoadGroups}
        onChangeLogo={this.handleChangeLogo}
        logoIsUploaded={this.state.logoIsUploaded}
        rewardInitialGroups={this.state.rewardInitialGroups}
        updateRewardLoading={this.props.updateRewardLoading}
        deleteRewardLoading={this.props.deleteRewardLoading}
        startPublishRewardLoading={this.props.startPublishRewardLoading}
        stopPublishRewardLoading={this.props.stopPublishRewardLoading}
      />
    );
  }
}

const RewardContent = enhance(RewardContentContainer, [withTranslation()]);
export default RewardContent;
