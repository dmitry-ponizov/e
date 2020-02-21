import React, {ChangeEvent} from 'react';
import SettingsPageLayout from 'pages/_Extension/SettingsPage/layout';
import {withTranslation, WithTranslation} from 'react-i18next';
import enhance from 'helpers/enhance'
import {US_STATES_SHORT} from 'constants/usStates';
import {IExtensionRootStore} from 'stores';
import {inject, observer} from 'mobx-react';
import GENDER_TYPES from 'constants/genderTypes';
import RELATIONSHIP_TYPES from 'constants/relationshipTypes';
import CHILDREN_TYPES from 'constants/childrenTypes';
import HOME_TYPES from 'constants/homeTypes';
import EDUCATION_TYPES from 'constants/educationTypes';
import EMPLOYMENT_TYPES from 'constants/employmentTypes';
import ETHNIC_TYPES from 'constants/ethnicTypes';
import INCOME_TYPES from 'constants/groupsIncomeTypes';
import CommonService from 'services/CommonService';
import Toast from 'components/Toast';
import getValidationAddressError from 'helpers/getValidationAddressError';
import {ExtensionRoute} from 'constants/extensionRoutes';

interface IInjectedProps {
  account: IAccount;
  updateAccountLoading: boolean;
  setRoute: (route: ExtensionRoute | null) => void;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  suggestions: IAddressSuggestion[];
}

@inject((rootStore: IExtensionRootStore): IInjectedProps => ({
  account: rootStore.authStore.account!,
  updateAccountLoading: rootStore.authStore.updateAccountLoading,
  setRoute: rootStore.simpleRouterStore.setRoute,
}))
@observer
class SettingsPageContainer extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  queryCache = '';
  coords: [string, string] | null = null;
  suggestionTimer: NodeJS.Timeout | null = null;

  componentWillUnmount(): void {
    // this.props.cleanErrors();
  }

  getInitialState = (): IState => {
    return {
      textFields: {
        firstName: {
          value: 'Sean',
          error: '',
        },
        lastName: {
          value: 'Mallean',
          error: '',
        },
        phone: {
          value: '+1 721 982 6381',
          error: '',
        },
        phoneType: {
          value: 'work',
          error: '',
        },
        address1: {
          value: '556 Summer Drive',
          error: '',
        },
        address2: {
          value: '11 Foxrun St.',
          error: '',
        },
        city: {
          value: 'Muskego',
          error: '',
        },
        zipCode: {
          value: '53150',
          error: '',
        },
    },
      selectFields: {
        state: {
          value: US_STATES_SHORT[0],
          error: '',
        },
        gender: {
          value: GENDER_TYPES[0],
          error: '',
        },
        relationship: {
          value: RELATIONSHIP_TYPES[0],
          error: '',
        },
        children: {
          value: CHILDREN_TYPES[0],
          error: '',
        },
        home: {
          value: HOME_TYPES[0],
          error: '',
        },
        yearOfBirth: {
          value: {
            value: '',
            label: ''
          } ,
          error: '',
        },
        education: {
          value: EDUCATION_TYPES[0],
          error: '',
        },
        employment: {
          value: EMPLOYMENT_TYPES[0],
          error: '',
        },
        ethnic: {
          value: ETHNIC_TYPES[0],
          error: '',
        },
        income: {
          value: INCOME_TYPES[0],
          error: '',
        },
      },
      suggestions: [],
    }
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
    return true;
  };

  handleSubmit = async () => {
    const isValid = await this.isValid();
    if (!isValid) return;

    // updateAccount(account.id, patch);
  };

  handlePageClose = () => {
    this.props.setRoute(null);
  };

  render(){
    return (
      <SettingsPageLayout
        t={this.props.t}
        updateAccountLoading={this.props.updateAccountLoading}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        suggestions={this.state.suggestions}
        onApplySuggestion={this.handleApplySuggestion}
        onChangeSelect={this.handleChangeSelect}
        onChangeTextField={this.handleChangeTextField}
        onSubmit={this.handleSubmit}
        onPageClose={this.handlePageClose}
      />
    )
  }
}

const SettingsPage = enhance(SettingsPageContainer, [withTranslation()]);
export default SettingsPage;
