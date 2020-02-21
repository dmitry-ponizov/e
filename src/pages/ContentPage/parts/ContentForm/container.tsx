import React, {ChangeEvent} from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import ContentPageLayout from './layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import LocationsService from 'services/LocationsService';
import GroupsService from 'services/GroupsService';
import config from 'constants/config';
import moment from 'moment';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';

const getFormattedDate = (time: string): string => {
  return moment(time ? time : Date.now()).format('MMM DD, YYYY');
};

let groups: IContentLocation[] = [];

interface IInjectedProps {
  selectedContentItemDetails: IContentItemDetails;
  updateContentImageError: string;
  clearErrors: () => void;
  toggleDeleteModal: (value: boolean, contentItemsIds: string[]) => void;
  updateContent: (contentItemId: string, data: Partial<IContentItemDetails>) => void;
  publishContentItems: (isPublished: boolean, data) => void;
  updateContentItemImage: (id: string, file: File | null) => void;
  getContentLoading: boolean;
  updateContentLoading: boolean;
  deleteContentItemLoading: boolean;
  contentPublishLoading: boolean;
  updateContentImageLoading: boolean;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  multiSelectFields: IMultiSelectsState;
  contentInitialGroups: IOption[];
  integrations: any;
  hasChanges: boolean;
  isImageUploaded: boolean;
  isContentCardHovered: boolean;
  cardConfig: {
    isImageShow: boolean;
    isLogoShow: boolean;
    content: {
      isCustom: boolean;
      isFacebook: boolean;
      isTwitter: boolean;
      isInstagram: boolean;
    };
    integrations: {
      reservation: boolean;
      delivery: boolean;
      schedule: boolean;
    };
  };
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedContentItemDetails: rootStore.contentStore.selectedContentItemDetails!,
    clearErrors: rootStore.contentStore.clearErrors,
    getContentLoading: rootStore.contentStore.getContentLoading,
    toggleDeleteModal: rootStore.contentStore.toggleDeleteModal,
    updateContent: rootStore.contentStore.updateContent,
    updateContentItemImage: rootStore.contentStore.updateContentItemImage,
    publishContentItems: rootStore.contentStore.publishContentItems,
    updateContentLoading: rootStore.contentStore.updateContentLoading,
    deleteContentItemLoading: rootStore.contentStore.deleteContentItemLoading,
    contentPublishLoading: rootStore.contentStore.contentPublishLoading,
    updateContentImageError: rootStore.contentStore.updateContentImageError,
    updateContentImageLoading: rootStore.contentStore.updateContentImageLoading,
  }),
)
@observer
class ContentFormContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  image: File | null = null;

  getInitialState = () => {
    const {name, location, groups, offer, isLogoEnabled, text, image} = this.props.selectedContentItemDetails;
    return {
      textFields: {
        name: {
          value: name,
          error: '',
        },
        rules: {
          value: offer?.conditions || '',
          error: '',
        },
        expirationDate: {
          value: offer?.expirationDate || '',
          error: '',
        },
        cardText: {
          value: text || '',
          error: '',
        },
        image: {
          value: image || '',
          error: '',
        },
      },
      selectFields: {
        location: {
          value: {
            label: location.name!,
            value: location.id,
          },
          error: '',
        },
      },
      multiSelectFields: {
        groups: {
          values: groups.map(group => group.id),
          error: '',
        },
      },
      contentInitialGroups: groups.map(group => ({
        label: group.name!,
        value: group.id,
      })),
      checkboxFields: {
        isOfferInclude: false,
        isSharingAllowed: offer?.isSharingAllowed || false,
        isLogoEnabled,
      },
      integrations: location.integrations!,
      hasChanges: false,
      isContentCardHovered: false,
      isImageUploaded: false,
      cardConfig: {
        content: {
          isCustom: true,
          isFacebook: false,
          isTwitter: false,
          isInstagram: false,
        },
        integrations: {
          reservation: true,
          delivery: false,
          schedule: false,
        },
        isImageShow: true,
        isLogoShow: true,
      },
    };
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.cardConfig.content.isCustom !== prevState.cardConfig.content.isCustom) {
      if (!this.state.cardConfig.content.isCustom) {
        this.switchToCustomMode();
      }
    }
  }

  handleToggleCardConfig = e => {
    this.setState({
      cardConfig: {
        ...this.state.cardConfig,
        [e.target.name]: this.state.cardConfig.content.isCustom ? !this.state.cardConfig[e.target.name] : false,
      },
    });
  };

  switchToCustomMode = (): void => {
    return this.setState({
      cardConfig: {
        ...this.state.cardConfig,
        integrations: {
          reservation: false,
          delivery: false,
          schedule: false,
        },
        isImageShow: false,
      },
    });
  };

  handleToggleContent = e => {
    this.setState(
      {
        cardConfig: {
          ...this.state.cardConfig,
          content: {
            isCustom: false,
            isFacebook: false,
            isTwitter: false,
            isInstagram: false,
            [e.target.name]: true,
          },
        },
      },
      () => {
        this.switchToCustomMode();
      },
    );
  };

  handleToggleIntegrations = e => {
    if (!this.state.cardConfig.content.isCustom) return;
    this.setState({
      cardConfig: {
        ...this.state.cardConfig,
        integrations: {
          reservation: false,
          delivery: false,
          schedule: false,
          [e.target.name]: true,
        },
      },
    });
  };

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      textFields: {
        ...this.state.textFields,
        [e.target.name]: {
          value: e.target.value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeSelect = (name: string, value: IOption) => {
    this.setState({
      selectFields: {
        ...this.state.selectFields,
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
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
      hasChanges: true,
    });
  };

  handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      checkboxFields: {
        ...this.state.checkboxFields,
        [e.target.name]: e.target.checked,
      },
      hasChanges: true,
    });
  };

  handleReset = () => {
    if (!this.props.selectedContentItemDetails) return;
    this.setState(this.getInitialState());
  };

  handleSave = () => {
    if (!this.isValid()) return;

    const {textFields, selectFields, multiSelectFields, checkboxFields, integrations} = this.state;
    console.log({integrations});

    this.props.updateContent(this.props.selectedContentItemDetails.id, {
      name: textFields.name.value,
      location: {
        name: selectFields.location.value!.value,
        id: selectFields.location.value!.value,
      },
      // lastPublishedContent: moment().format('MMM D, YYYY'),
      groups: multiSelectFields.groups.values.map(group => {
        return {
          id: group,
          name: '',
        };
      }),
      offer: {
        conditions: textFields.rules.value,
        isSharingAllowed: checkboxFields.isSharingAllowed,
        expirationDate: getFormattedDate(textFields.expirationDate.value),
      },
      isLogoEnabled: checkboxFields.isLogoEnabled,
      // TODO: refactor integrations[0].id
      integrationId: integrations[0].id || null,
      text: textFields.rules.value,
    });
    this.setState({hasChanges: false});
  };

  handleDeleteContent = () => {
    this.props.toggleDeleteModal(true, [this.props.selectedContentItemDetails.id]);
  };

  handlePublishContent = (isPublished: boolean) => {
    this.props.publishContentItems(isPublished, {
      contentDraftIds: [this.props.selectedContentItemDetails.id],
    });
  };

  onLoadLocations = async (filter, loadedOptions) => {
    const transport = await LocationsService.getLocations({
      filter,
      offset: loadedOptions.length,
    });

    if (!transport.success) {
      return {
        options: [],
        hasMore: false,
      };
    }

    const locations = transport.response
      ? transport.response.data.data.map(location => ({value: location.id, label: location.name}))
      : [];

    return {
      options: locations,
      hasMore: locations.length,
    };
  };

  onLoadGroups = async loadedOptions => {
    const transport = await GroupsService.getGroups({
      offset: loadedOptions.length,
      per_page: config.COMMON.itemsPerPage,
    });

    if (!transport.success) {
      return {
        items: [],
        hasMore: false,
      };
    }
    groups = transport.response.data.data.map(group => ({id: group.id, name: group.name}));
    return {
      items: groups.map(group => ({value: group.id, label: group.name!})),
      hasMore: groups.length === config.COMMON.itemsPerPage,
    };
  };

  handleChangeImage = (imageUrl: string, image: File | null) => {
    if (image && !config.FILES.validTypes.find(type => type === image.type)) {
      URL.revokeObjectURL(imageUrl);
      return Toast.show(MESSAGES.invalidPictureType, {type: 'danger'});
    }
    if (image && image.size >= config.FILES.maxSize) {
      URL.revokeObjectURL(imageUrl);
      return Toast.show(MESSAGES.invalidPictureSize, {type: 'danger'});
    }

    this.setState({
      textFields: {
        ...this.state.textFields,
        image: {
          ...this.state.textFields.image,
          value: imageUrl,
        },
      },
      isImageUploaded: false,
      hasChanges: true,
    });
    this.image = image;
  };

  handleUploadImage = async () => {
    await this.props.updateContentItemImage(this.props.selectedContentItemDetails.id, this.image);
    if (this.props.updateContentImageError) return;
    this.setState({isImageUploaded: true});
    this.image = null;
  };

  isValid = (): boolean => {
    // TODO: add validation fields
    return true;
  };

  render() {
    const {textFields, selectFields, checkboxFields, multiSelectFields} = this.state;
    const {businessName, address1, phone, title, logo} = this.props.selectedContentItemDetails.location.business!;
    return (
      <ContentPageLayout
        t={this.props.t}
        cardConfig={this.state.cardConfig}
        cardContent={{
          name: textFields.name.value,
          logo: logo!,
          rules: textFields.rules.value,
          expires: getFormattedDate(textFields.expirationDate.value),
          image: this.state.textFields.image.value,
          offerCode: 324,
        }}
        cardInfoBar={{
          points: 234,
          program: '$ 5.00 = 1 point',
          level: 555,
          reward: '10 % of next visit',
          next: '$ 15.00',
        }}
        cardMerchantData={{
          title: title!,
          name: businessName!,
          address: address1!,
          phone: phone!,
          type: 'IT ', // TODO: find this value
          workTime: '24/7', // TODO: find this value
        }}
        cardSocialData={['49', '9', '13', '7']}
        textFields={textFields}
        selectFields={selectFields}
        checkboxFields={checkboxFields}
        multiSelectFields={multiSelectFields}
        getContentLoading={this.props.getContentLoading}
        onChangeTextField={this.handleChangeTextField}
        onChangeSelectField={this.handleChangeSelect}
        onChangeCheckboxField={this.handleChangeCheckbox}
        onToggleContent={this.handleToggleContent}
        onToggleCardConfig={this.handleToggleCardConfig}
        onToggleIntegrations={this.handleToggleIntegrations}
        onChangeMultiSelect={this.handleChangeMultiSelect}
        onUpdateContent={this.handleSave}
        onDeleteContent={this.handleDeleteContent}
        onPublishContent={this.handlePublishContent}
        onLoadLocations={this.onLoadLocations}
        onLoadGroups={this.onLoadGroups}
        contentInitialGroups={this.state.contentInitialGroups}
        updateContentLoading={this.props.updateContentLoading}
        deleteContentItemLoading={this.props.deleteContentItemLoading}
        contentPublishLoading={this.props.contentPublishLoading}
        selectedContentItemDetails={this.props.selectedContentItemDetails}
        hasChanges={this.state.hasChanges}
        isContentCardHovered={this.state.isContentCardHovered}
        onChangeImage={this.handleChangeImage}
        onUploadImage={this.handleUploadImage}
        isImageUploaded={this.state.isImageUploaded}
        updateContentImageError={this.props.updateContentImageError}
        updateContentImageLoading={this.props.updateContentImageLoading}
      />
    );
  }
}

const ContentForm = enhance(ContentFormContainer, [withTranslation()]);
export default ContentForm;
