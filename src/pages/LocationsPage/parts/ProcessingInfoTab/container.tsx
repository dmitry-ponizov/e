import React, {ChangeEvent} from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import ProcessingInfoTabLayout from 'pages/LocationsPage/parts/ProcessingInfoTab/layout';
import {US_STATES_SHORT} from 'constants/usStates';
import config from 'constants/config';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';
import validateField from 'helpers/validator';
import VP from 'constants/validationPatterns';

interface IProps {
  paymentSystem: PaymentSystem;
}

interface IInjectedProps {
  selectedLocation: ILocation | null;
  selectedLocationDetails: ILocationDetails;
  updateLocationLoading: boolean;
  updateLocationError: string;
  updateLocationProcessingInfo: (paymentSystem: string, data: Partial<ILocationProcessingInfo>) => Promise<void>;
  updateLocationProcessingInfoLogo: (paymentSystem: PaymentSystem, file: File | null) => Promise<void>;
  setActiveLocationTab: (activeLocationTab: LocationTabType) => void;
  clearErrors: () => void;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  hasChanges: boolean;
  exitModalIsOpen: boolean;
  logoIsUploaded: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedLocation: rootStore.locationsStore.selectedLocation,
    selectedLocationDetails: rootStore.locationsStore.selectedLocationDetails!,
    updateLocationLoading: rootStore.locationsStore.updateLocationLoading,
    updateLocationError: rootStore.locationsStore.updateLocationError,
    updateLocationProcessingInfo: rootStore.locationsStore.updateLocationProcessingInfo,
    updateLocationProcessingInfoLogo: rootStore.locationsStore.updateLocationProcessingInfoLogo,
    setActiveLocationTab: rootStore.locationsStore.setActiveLocationTab,
    clearErrors: rootStore.locationsStore.clearErrors,
  }),
)
@observer
class ProcessingInfoTabContainer extends React.Component<
  IProps & IInjectedProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.paymentSystem, props.selectedLocationDetails);
  }

  requestedTab: LocationTabType | null = null;
  logo: File | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (paymentSystem: PaymentSystem, selectedLocationDetails: ILocationDetails): IState => {
    let details;
    switch (paymentSystem) {
      case 'ae':
        details = selectedLocationDetails.ae;
        break;
      case 'vm':
        details = selectedLocationDetails.vm;
        break;
      case 'dc':
        details = selectedLocationDetails.dc;
        break;
    }

    return {
      textFields: {
        merchantId: {
          value: details.merchantId,
          error: '',
        },
        acquirer: {
          value: details.acquirer,
          error: '',
        },
        frontEndProcessor: {
          value: details.frontEndProcessor,
          error: '',
        },
        backEndProcessor: {
          value: details.backEndProcessor,
          error: '',
        },
        name: {
          value: details.name,
          error: '',
        },
        city: {
          value: details.city,
          error: '',
        },
        zipCode: {
          value: details.zipCode,
          error: '',
        },
        logo: {
          value: details.logo,
          error: '',
        },
        country: {
          value: 'US',
          error: '',
        },
      },
      selectFields: {
        state: {
          value: US_STATES_SHORT.find(state => state.value === details.state) || null,
          error: '',
        },
      },
      hasChanges: false,
      exitModalIsOpen: false,
      logoIsUploaded: true,
    };
  };

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
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
      hasChanges: true,
    });
  };

  handleChangeSelect = (name: string, value: IOption) => {
    const {selectFields} = this.state;

    if (name === 'countryState') {
      const {city, countryState} = selectFields;
      this.setState({
        selectFields: {
          ...selectFields,
          countryState: {
            value,
            error: countryState.error,
          },
          city: {
            value: null,
            error: city.error,
          },
        },
        hasChanges: true,
      });
      return;
    }

    this.setState({
      selectFields: {
        ...selectFields,
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeLogo = (logoUrl: string, logo: File | null) => {
    if (logo && !config.FILES.validTypes.find(type => type === logo.type)) {
      Toast.show(MESSAGES.invalidPictureType, {type: 'danger'});
      URL.revokeObjectURL(logoUrl);
      return;
    }
    if (logo && logo.size >= config.FILES.maxSize) {
      Toast.show(MESSAGES.invalidPictureSize, {type: 'danger'});
      URL.revokeObjectURL(logoUrl);
      return;
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
    });
    this.logo = logo;
  };

  handleRequestChangeTab = (tab: LocationTabType) => {
    if (this.state.hasChanges) {
      this.requestedTab = tab;
      this.setState({exitModalIsOpen: true});
    } else {
      this.props.setActiveLocationTab(tab);
    }
  };

  handleChangeTabAnswer = async (answer: ExitAnswer): Promise<void> => {
    switch (answer) {
      case 'continue':
        if (this.requestedTab) {
          this.props.setActiveLocationTab(this.requestedTab);
        }
        break;
      case 'cancel':
        this.setState({exitModalIsOpen: false});
        this.requestedTab = null;
        break;
      case 'save-continue':
        this.setState({exitModalIsOpen: false});
        await this.handleSave();
        if (!this.props.updateLocationError && this.requestedTab) {
          this.props.setActiveLocationTab(this.requestedTab);
        }
        break;
    }
  };

  handleReset = () => {
    this.setState(this.getInitialState(this.props.paymentSystem, this.props.selectedLocationDetails));
  };

  handleUploadLogo = async () => {
    const {updateLocationProcessingInfoLogo} = this.props;
    await updateLocationProcessingInfoLogo(this.props.paymentSystem, this.logo);
    if (this.props.updateLocationError) return;
    this.setState({
      logoIsUploaded: true,
    });
    this.logo = null;
  };

  isValid = async () => {
    const {textFields, selectFields} = this.state;

    const frontEndProcessorError = validateField(
      VP.location.processingInfo.frontEndProcessor,
      textFields.frontEndProcessor.value,
    );
    const backEndProcessorError = validateField(
      VP.location.processingInfo.backEndProcessor,
      textFields.backEndProcessor.value,
    );
    const nameError = validateField(VP.location.processingInfo.name, textFields.name.value);
    const cityError = validateField(VP.location.processingInfo.city, textFields.city.value);
    const stateError = validateField(
      VP.location.processingInfo.state,
      selectFields.state.value ? selectFields.state.value.value : '',
    );
    const zipCodeError = validateField(VP.location.processingInfo.zipCode, textFields.zipCode.value);

    this.setState({
      textFields: {
        ...textFields,
        frontEndProcessor: {
          value: textFields.frontEndProcessor.value,
          error: frontEndProcessorError,
        },
        backEndProcessor: {
          value: textFields.backEndProcessor.value,
          error: backEndProcessorError,
        },
        name: {
          value: textFields.name.value,
          error: nameError,
        },
        city: {
          value: textFields.city.value,
          error: cityError,
        },
        zipCode: {
          value: textFields.zipCode.value,
          error: zipCodeError,
        },
      },
      selectFields: {
        ...selectFields,
        state: {
          value: selectFields.state.value,
          error: stateError,
        },
      },
    });

    return !(frontEndProcessorError || backEndProcessorError || nameError || cityError || stateError || zipCodeError);
  };

  handleSave = async () => {
    const isValid = await this.isValid();
    if (!isValid) return;

    const {textFields, selectFields} = this.state;
    await this.props.updateLocationProcessingInfo(this.props.paymentSystem, {
      frontEndProcessor: textFields.frontEndProcessor.value,
      backEndProcessor: textFields.backEndProcessor.value,
      name: textFields.name.value,
      city: textFields.city.value,
      state: selectFields.state.value ? selectFields.state.value.value : null,
      zipCode: textFields.zipCode.value,
    });

    if (!this.props.updateLocationError) {
      this.setState({
        hasChanges: false,
      });
    }
  };

  render() {
    return (
      <ProcessingInfoTabLayout
        t={this.props.t}
        paymentSystem={this.props.paymentSystem}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        onChangeTextField={this.handleChangeTextField}
        onChangeSelect={this.handleChangeSelect}
        onChangeLogo={this.handleChangeLogo}
        logoIsUploaded={this.state.logoIsUploaded}
        onUploadLogo={this.handleUploadLogo}
        onReset={this.handleReset}
        onSave={this.handleSave}
        selectedLocation={this.props.selectedLocation}
        hasChanges={this.state.hasChanges}
        updateLocationLoading={this.props.updateLocationLoading}
        onRequestChangeTab={this.handleRequestChangeTab}
        onChangeTabAnswer={this.handleChangeTabAnswer}
        exitModalIsOpen={this.state.exitModalIsOpen}
      />
    );
  }
}

const ProcessingInfoTab = enhance(ProcessingInfoTabContainer, [withTranslation()]);
export default ProcessingInfoTab;
