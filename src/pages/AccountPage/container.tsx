import React, {ChangeEvent, SyntheticEvent} from 'react';
import {inject, observer} from 'mobx-react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import AccountPageLayout from 'pages/AccountPage/layout';
import {IRootStore} from 'stores';
import enhance from 'helpers/enhance';
import CommonService from 'services/CommonService';
import Toast from 'components/Toast';
import getValidationAddressError from 'helpers/getValidationAddressError';
import ENTITY_TYPES from 'constants/entityTypes';
import validateField from 'helpers/validator';
import VP from 'constants/validationPatterns';
import {US_STATES_SHORT} from 'constants/usStates';
import MESSAGES from 'constants/messages';
import config from 'constants/config';

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  suggestions: IAddressSuggestion[];
  logoIsUploaded: boolean;
}

interface IInjectedProps {
  account: IAccount;
  updateAccount: (id: string, account: Partial<IAccount>) => Promise<void>;
  updateAccountLogo: (id: string, file: File | null) => Promise<void>;
  updateAccountLoading: boolean;
  updateAccountError: string;
  resetPassword: (email: string) => Promise<void>;
  resetPasswordLoading: boolean;
  cleanErrors: () => void;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    updateAccount: rootStore.authStore.updateAccount,
    updateAccountLogo: rootStore.authStore.updateAccountLogo,
    updateAccountLoading: rootStore.authStore.updateAccountLoading,
    updateAccountError: rootStore.authStore.updateAccountError,
    resetPassword: rootStore.authStore.resetPassword,
    resetPasswordLoading: rootStore.authStore.resetPasswordLoading,
    cleanErrors: rootStore.authStore.cleanErrors,
  }),
)
@observer
class AccountPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.account);
  }

  queryCache = '';
  coords: [string, string] | null = null;
  suggestionTimer: NodeJS.Timeout | null = null;
  logo: File | null = null;

  componentWillUnmount(): void {
    this.props.cleanErrors();
  }

  getInitialState = (account: IAccount): IState => {
    return {
      textFields: {
        userFirstName: {
          value: account.firstName || '',
          error: '',
        },
        userLastName: {
          value: account.lastName || '',
          error: '',
        },
        userEmail: {
          value: account.email || '',
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
        businessLegalName: {
          value: account.businessLegalName || '',
          error: '',
        },
        businessWorkingName: {
          value: account.businessWorkingName || '',
          error: '',
        },
        jobTitle: {
          value: account.title || '',
          error: '',
        },
        businessFirstName: {
          value: account.businessFirstName || '',
          error: '',
        },
        businessLastName: {
          value: account.businessLastName || '',
          error: '',
        },
        businessEmail: {
          value: account.businessEmail || '',
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
          value: account.phoneType || 'work',
          error: '',
        },
        logo: {
          value: account.logo || '',
          error: '',
        },
      },
      selectFields: {
        entityType: {
          value: ENTITY_TYPES.find(type => type.value === account.entityType) || null,
          error: '',
        },
        state: {
          value: US_STATES_SHORT.find(state => state.value === account.state) || null,
          error: '',
        },
      },
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
    });

    if (name === 'address1') {
      this.setSuggestionTimer(value);
    }
  };

  handleChangeSelect = (name: string, value: IOption) => {
    const {selectFields} = this.state;

    this.setState({
      selectFields: {
        ...selectFields,
        [name]: {
          value,
          error: '',
        },
      },
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
    /// skipp if is not actual
    if (this.queryCache !== query) return;
    if (!transport.success) {
      Toast.show(transport.message, {type: 'danger'});
      return;
    }
    this.setState({
      suggestions: transport.response.data.suggestions || [],
    });
  };

  handleApplySuggestion = (suggestion?: IAddressSuggestion) => {
    const {textFields, selectFields} = this.state;
    if (suggestion) {
      this.setState({
        textFields: {
          ...textFields,
          address1: {
            value: suggestion.street_line,
            error: '',
          },
          city: {
            value: suggestion.city,
            error: '',
          },
        },
        selectFields: {
          ...selectFields,
          state: {
            value: US_STATES_SHORT.find(state => state.value === suggestion.state) || null,
            error: '',
          },
        },
        suggestions: [],
      });
    } else {
      this.setState({
        suggestions: [],
      });
    }
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
    const {textFields, selectFields} = this.state;

    const businessLegalNameError = validateField(VP.account.businessLegalName, textFields.businessLegalName.value);
    const businessWorkingNameError = validateField(
      VP.account.businessWorkingName,
      textFields.businessWorkingName.value,
    );
    const entityTypeError = validateField(
      VP.account.entityType,
      selectFields.entityType.value ? selectFields.entityType.value.value : '',
    );
    const jobTitleError = validateField(VP.account.jobTitle, textFields.jobTitle.value);
    const businessFirstNameError = validateField(VP.account.businessFirstName, textFields.businessFirstName.value);
    const businessLastNameError = validateField(VP.account.businessLastName, textFields.businessLastName.value);
    const businessEmailError = validateField(VP.account.businessEmail, textFields.businessEmail.value);
    const phoneError = validateField(VP.account.phone, textFields.phone.value);

    const userFirstNameError = validateField(VP.account.userFirstName, textFields.userFirstName.value);
    const userLastNameError = validateField(VP.account.userLastName, textFields.userLastName.value);

    const address1Error = validateField(VP.account.address1, textFields.address1.value);
    const cityError = validateField(VP.account.city, textFields.city.value);
    const stateError = validateField(VP.account.state, selectFields.state.value ? selectFields.state.value.value : '');
    const zipCodeError = validateField(VP.account.zipCode, textFields.zipCode.value);

    const fieldsIsValid = !(
      businessLegalNameError ||
      businessWorkingNameError ||
      entityTypeError ||
      jobTitleError ||
      businessFirstNameError ||
      businessLastNameError ||
      businessEmailError ||
      phoneError ||
      userFirstNameError ||
      userLastNameError ||
      address1Error ||
      cityError ||
      stateError ||
      zipCodeError
    );

    let addressError = '';
    if (fieldsIsValid) {
      addressError = await this.validateAddress();
    }

    this.setState({
      textFields: {
        ...textFields,
        businessLegalName: {
          value: textFields.businessLegalName.value,
          error: businessLegalNameError,
        },
        businessWorkingName: {
          value: textFields.businessWorkingName.value,
          error: businessWorkingNameError,
        },
        jobTitle: {
          value: textFields.jobTitle.value,
          error: jobTitleError,
        },
        businessFirstName: {
          value: textFields.businessFirstName.value,
          error: businessFirstNameError,
        },
        businessLastName: {
          value: textFields.businessLastName.value,
          error: businessLastNameError,
        },
        businessEmail: {
          value: textFields.businessEmail.value,
          error: businessEmailError,
        },
        phone: {
          value: textFields.phone.value,
          error: phoneError,
        },
        userFirstName: {
          value: textFields.userFirstName.value,
          error: userFirstNameError,
        },
        userLastName: {
          value: textFields.userLastName.value,
          error: userLastNameError,
        },
        address1: {
          value: textFields.address1.value,
          error: address1Error || addressError,
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
        entityType: {
          value: selectFields.entityType.value,
          error: entityTypeError,
        },
        state: {
          value: selectFields.state.value,
          error: stateError,
        },
      },
    });

    return fieldsIsValid && !addressError;
  };

  handleUploadLogo = async () => {
    const {updateAccountLogo, account} = this.props;
    await updateAccountLogo(account.id, this.logo);
    if (this.props.updateAccountError) return;
    this.setState({
      logoIsUploaded: true,
    });
    this.logo = null;
  };

  handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await this.isValid();
    if (!isValid) return;

    const {updateAccount, account} = this.props;
    const {textFields, selectFields} = this.state;

    const patch: Partial<IAccount> = {
      businessLegalName: textFields.businessLegalName.value,
      businessWorkingName: textFields.businessWorkingName.value,
      entityType: selectFields.entityType.value ? selectFields.entityType.value.value : null,
      title: textFields.jobTitle.value,
      businessFirstName: textFields.businessFirstName.value,
      businessLastName: textFields.businessLastName.value,
      businessEmail: textFields.businessEmail.value,
      phone: textFields.phone.value,
      phoneType: textFields.phoneType.value,

      firstName: textFields.userFirstName.value,
      lastName: textFields.userLastName.value,

      address1: textFields.address1.value,
      address2: textFields.address2.value,
      state: selectFields.state.value ? selectFields.state.value.value : null,
      city: textFields.city.value,
      zipCode: textFields.zipCode.value,
      latitude: this.coords ? this.coords[0] : null,
      longitude: this.coords ? this.coords[1] : null,
    };

    updateAccount(account.id, patch);
  };

  handleResetPassword = () => {
    this.props.resetPassword(this.props.account.email);
  };

  render() {
    return (
      <AccountPageLayout
        t={this.props.t}
        resetPasswordLoading={this.props.resetPasswordLoading}
        updateAccountLoading={this.props.updateAccountLoading}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        suggestions={this.state.suggestions}
        onApplySuggestion={this.handleApplySuggestion}
        onChangeSelect={this.handleChangeSelect}
        onChangeTextField={this.handleChangeTextField}
        onSubmit={this.handleSubmit}
        onResetPassword={this.handleResetPassword}
        onChangeLogo={this.handleChangeLogo}
        onUploadLogo={this.handleUploadLogo}
        logoIsUploaded={this.state.logoIsUploaded}
      />
    );
  }
}

const AccountPage = enhance(AccountPageContainer, [withRouter, withTranslation()]);
export default AccountPage;
