import React, {ChangeEvent} from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import ContactTabLayout from 'pages/LocationsPage/parts/ContactTab/layout';
import {US_STATES_SHORT} from 'constants/usStates';
import CommonService from 'services/CommonService';
import Toast from 'components/Toast';
import getValidationAddressError from 'helpers/getValidationAddressError';
import config from 'constants/config';
import MESSAGES from 'constants/messages';
import validateField from 'helpers/validator';
import VP from 'constants/validationPatterns';

interface IInjectedProps {
  account: IAccount;
  selectedLocation: ILocation;
  selectedLocationDetails: ILocationDetails;
  updateLocationLoading: boolean;
  updateLocationError: string;
  updateLocationContact: (businessId: string, data: Partial<ILocationContact>) => Promise<void>;
  updateLocationContactLogo: (id: string, url: string, file: File | null) => Promise<void>;
  setActiveLocationTab: (activeLocationTab: LocationTabType) => void;
  clearErrors: () => void;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  suggestions: IAddressSuggestion[];
  logoIsUploaded: boolean;
  sameAsAccount: boolean;
  hasChanges: boolean;
  exitModalIsOpen: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    selectedLocation: rootStore.locationsStore.selectedLocation!,
    selectedLocationDetails: rootStore.locationsStore.selectedLocationDetails!,
    updateLocationLoading: rootStore.locationsStore.updateLocationLoading,
    updateLocationError: rootStore.locationsStore.updateLocationError,
    updateLocationContact: rootStore.locationsStore.updateLocationContact,
    updateLocationContactLogo: rootStore.locationsStore.updateLocationContactLogo,
    setActiveLocationTab: rootStore.locationsStore.setActiveLocationTab,
    clearErrors: rootStore.locationsStore.clearErrors,
  }),
)
@observer
class ContactTabContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedLocationDetails);
  }

  requestedTab: LocationTabType | null = null;
  queryCache = '';
  coords: [string, string] | null = null;
  suggestionTimer: NodeJS.Timeout | null = null;
  logo: File | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedLocationDetails: ILocationDetails): IState => {
    return {
      textFields: {
        businessName: {
          value: selectedLocationDetails.contact.businessName || '',
          error: '',
        },
        firstName: {
          value: selectedLocationDetails.contact.firstName || '',
          error: '',
        },
        lastName: {
          value: selectedLocationDetails.contact.lastName || '',
          error: '',
        },
        title: {
          value: selectedLocationDetails.contact.title || '',
          error: '',
        },
        email: {
          value: selectedLocationDetails.contact.email || '',
          error: '',
        },
        phone: {
          value: selectedLocationDetails.contact.phone || '',
          error: '',
        },
        phoneType: {
          value: selectedLocationDetails.contact.phoneType || 'work',
          error: '',
        },
        address1: {
          value: selectedLocationDetails.contact.address1 || '',
          error: '',
        },
        address2: {
          value: selectedLocationDetails.contact.address2 || '',
          error: '',
        },
        city: {
          value: selectedLocationDetails.contact.city || '',
          error: '',
        },
        zipCode: {
          value: selectedLocationDetails.contact.zipCode || '',
          error: '',
        },
        logo: {
          value: selectedLocationDetails.contact.logo || '',
          error: '',
        },
      },
      selectFields: {
        state: {
          value: US_STATES_SHORT.find(state => state.value === selectedLocationDetails.contact.state) || null,
          error: '',
        },
      },
      sameAsAccount: false,
      hasChanges: false,
      exitModalIsOpen: false,
      suggestions: [],
      logoIsUploaded: true,
    };
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

    if (name === 'address1') {
      this.setSuggestionTimer(value);
    }
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

  handleChangeCheckbox = () => {
    const {textFields, selectFields} = this.state;
    const {account} = this.props;

    if (!this.state.sameAsAccount) {
      this.setState({
        textFields: {
          ...textFields,
          businessName: {
            value: account.businessLegalName || '',
            error: '',
          },
          firstName: {
            value: account.firstName || '',
            error: '',
          },
          lastName: {
            value: account.lastName || '',
            error: '',
          },
          title: {
            value: account.title || '',
            error: '',
          },
          email: {
            value: account.email || '',
            error: '',
          },
          phone: {
            value: account.phone || '',
            error: '',
          },
          phoneType: {
            value: account.phoneType || '',
            error: '',
          },
          address1: {
            value: account.address1 || '',
            error: '',
          },
          address2: {
            value: account.address2 || '',
            error: '',
          },
          city: {
            value: account.city || '',
            error: '',
          },
          zipCode: {
            value: account.zipCode || '',
            error: '',
          },
        },
        selectFields: {
          ...selectFields,
          state: {
            value: US_STATES_SHORT.find(state => state.value === account.state) || null,
            error: '',
          },
        },
        sameAsAccount: !this.state.sameAsAccount,
        hasChanges: true,
      });
    } else {
      this.setState({
        sameAsAccount: !this.state.sameAsAccount,
        hasChanges: true,
      });
    }
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
    this.setState(this.getInitialState(this.props.selectedLocationDetails));
  };

  setSuggestionTimer = (query: string) => {
    if (this.queryCache === query || query.length < 5) return;
    this.queryCache = query;
    if (this.suggestionTimer) clearTimeout(this.suggestionTimer);
    this.suggestionTimer = setTimeout(() => {
      this.getSuggestions(query);
    }, 500);
  };

  getSuggestions = async (query: string): Promise<void> => {
    const transport = await CommonService.suggestAddress(query);
    /// skip if is not actual
    if (this.queryCache !== query) return;
    if (!transport.success) {
      return Toast.show(transport.message, {type: 'danger'});
    }
    this.setState({
      suggestions: transport.response.data.suggestions || [],
    });
  };

  handleApplySuggestion = (suggestion?: IAddressSuggestion) => {
    if (!suggestion) {
      return this.setState({suggestions: []});
    }
    this.setState({
      textFields: {
        ...this.state.textFields,
        address1: {
          value: suggestion!.street_line,
          error: '',
        },
        city: {
          value: suggestion!.city,
          error: '',
        },
      },
      selectFields: {
        ...this.state.selectFields,
        state: {
          value: US_STATES_SHORT.find(state => state.value === suggestion!.state) || null,
          error: '',
        },
      },
      suggestions: [],
    });
  };

  validateAddress = async (): Promise<string> => {
    const {address1, address2, city, zipCode} = this.state.textFields;
    const {state} = this.state.selectFields;
    if (!address1.value && !address2.value && !state.value && !city.value && !zipCode.value) return '';

    const transport = await CommonService.validateAddress({
      street: address1.value,
      street2: address2.value,
      city: city.value,
      state: state.value!.value,
      zipCode: zipCode.value,
    });

    if (!transport.success) {
      Toast.show(transport.message, {type: 'danger'});
      return transport.message;
    }

    const error = getValidationAddressError(transport.response.data);
    if (!error) {
      this.coords = [
        `${transport.response.data[0].metadata.latitude}`,
        `${transport.response.data[0].metadata.longitude}`,
      ];
    }

    return error;
  };

  isValid = async (): Promise<boolean> => {
    const {textFields} = this.state;
    const address1Error = await this.validateAddress();
    const phoneError = validateField(VP.location.contact.phone, textFields.phone.value);
    const firstNameError = validateField(VP.location.contact.firstName, textFields.firstName.value);
    const titleError = validateField(VP.location.contact.title, textFields.title.value);
    const lastNameError = validateField(VP.location.contact.lastName, textFields.lastName.value);
    const emailError = validateField(VP.location.contact.email, textFields.email.value);

    this.setState({
      textFields: {
        ...textFields,
        address1: {
          ...textFields.address1,
          error: address1Error,
        },
        title: {
          ...textFields.title,
          error: titleError,
        },
        firstName: {
          ...textFields.firstName,
          error: firstNameError,
        },
        lastName: {
          ...textFields.lastName,
          error: lastNameError,
        },
        email: {
          ...textFields.email,
          error: emailError,
        },
        phone: {
          ...textFields.phone,
          error: phoneError,
        },
      },
    });

    return !(address1Error || phoneError || emailError || firstNameError || lastNameError || titleError);
  };

  handleUploadLogo = async () => {
    const {updateLocationContactLogo, selectedLocationDetails} = this.props;
    const {textFields} = this.state;
    await updateLocationContactLogo(selectedLocationDetails.contact.id, textFields.logo.value, this.logo);
    if (this.props.updateLocationError) return;
    this.setState({
      logoIsUploaded: true,
    });
    this.logo = null;
  };

  handleSave = async (): Promise<void> => {
    const isValid = await this.isValid();
    if (!isValid) return;

    const {selectedLocationDetails} = this.props;
    const {textFields, selectFields} = this.state;

    await this.props.updateLocationContact(selectedLocationDetails.contact.id, {
      businessName: textFields.businessName.value,
      firstName: textFields.firstName.value,
      lastName: textFields.lastName.value,
      title: textFields.title.value,
      email: textFields.email.value,
      phone: textFields.phone.value,
      phoneType: textFields.phoneType.value,

      address1: textFields.address1.value,
      address2: textFields.address2.value,
      city: textFields.city.value,
      state: selectFields.state.value ? selectFields.state.value.value : null,
      zipCode: textFields.zipCode.value,
      latitude: this.coords ? this.coords[0] : null,
      longitude: this.coords ? this.coords[1] : null,
    });

    if (!this.props.updateLocationError) {
      this.setState({
        hasChanges: false,
      });
    }
  };

  render() {
    return (
      <ContactTabLayout
        t={this.props.t}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        sameAsAccount={this.state.sameAsAccount}
        suggestions={this.state.suggestions}
        onChangeTextField={this.handleChangeTextField}
        onChangeLogo={this.handleChangeLogo}
        onChangeSelect={this.handleChangeSelect}
        onChangeCheckbox={this.handleChangeCheckbox}
        onReset={this.handleReset}
        onSave={this.handleSave}
        selectedLocation={this.props.selectedLocation}
        hasChanges={this.state.hasChanges}
        updateLocationLoading={this.props.updateLocationLoading}
        onRequestChangeTab={this.handleRequestChangeTab}
        onChangeTabAnswer={this.handleChangeTabAnswer}
        exitModalIsOpen={this.state.exitModalIsOpen}
        onApplySuggestion={this.handleApplySuggestion}
        logoIsUploaded={this.state.logoIsUploaded}
        onUploadLogo={this.handleUploadLogo}
      />
    );
  }
}

const ContactInfoTab = enhance(ContactTabContainer, [withTranslation()]);
export default ContactInfoTab;
