import React, {ChangeEvent} from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import ProfileTabLayout from 'pages/LocationsPage/parts/ProfileTab/layout';
import ENTITY_TYPES, {ENTITY_TYPES_VARIANTS} from 'constants/entityTypes';
import LOCATION_TYPES from 'constants/locationTypes';
import CHANNEL_TYPES from 'constants/channelTypes';
import LocationsService from 'services/LocationsService';
import TIMEZONES from 'constants/timeZones';
import config from 'constants/config';
import validateField from 'helpers/validator';
import VP from 'constants/validationPatterns';
import moment from 'moment';

interface IInjectedProps {
  account: IAccount;
  selectedLocation: ILocation | null;
  selectedLocationDetails: ILocationDetails;
  updateLocationLoading: boolean;
  updateLocationError: string;
  updateLocationProfile: (businessId: string, data: Partial<ILocationProfile>) => Promise<void>;
  setActiveLocationTab: (activeLocationTab: LocationTabType) => void;
  clearErrors: () => void;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  hasChanges: boolean;
  exitModalIsOpen: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    selectedLocation: rootStore.locationsStore.selectedLocation,
    selectedLocationDetails: rootStore.locationsStore.selectedLocationDetails!,
    updateLocationLoading: rootStore.locationsStore.updateLocationLoading,
    updateLocationError: rootStore.locationsStore.updateLocationError,
    updateLocationProfile: rootStore.locationsStore.updateLocationProfile,
    setActiveLocationTab: rootStore.locationsStore.setActiveLocationTab,
    clearErrors: rootStore.locationsStore.clearErrors,
  }),
)
@observer
class ProfileTabContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedLocationDetails);
  }

  requestedTab: LocationTabType | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedLocationDetails: ILocationDetails): IState => {
    const {account} = this.props;
    const {profile} = selectedLocationDetails;
    const entityType = ENTITY_TYPES.find(type => type.value === selectedLocationDetails.profile.entityType) || null;

    return {
      textFields: {
        description: {
          value: profile.description || '',
          error: '',
        },
        openedDate: {
          value: moment(profile.locationOpenedAt || undefined).format(config.COMMON.dateFormat),
          error: '',
        },
        employees: {
          value: profile.numberOfEmployees ? `${profile.numberOfEmployees}` : '',
          error: '',
        },
      },
      selectFields: {
        naics: {
          value: profile.naics
            ? {
                value: profile.naics,
                label: profile.naics,
              }
            : null,
          error: '',
        },
        sic: {
          value: profile.sic
            ? {
                value: profile.sic,
                label: profile.sic,
              }
            : null,
          error: '',
        },
        mcc: {
          value: profile.mcc
            ? {
                value: profile.mcc,
                label: profile.mcc,
              }
            : null,
          error: '',
        },
        entityTypeVariant: {
          value:
            entityType && entityType.value === account.entityType ? ENTITY_TYPES_VARIANTS[0] : ENTITY_TYPES_VARIANTS[1],
          error: '',
        },
        entityType: {
          value: entityType,
          error: '',
        },
        locationType: {
          value: LOCATION_TYPES.find(type => type.value === profile.locationType) || null,
          error: '',
        },
        channelType: {
          value: CHANNEL_TYPES.find(type => type.value === profile.channelType) || null,
          error: '',
        },
        timeZone: {
          value: TIMEZONES.find(timezone => timezone.value === `${profile.timeZone}`) || null,
          error: '',
        },
      },
      hasChanges: false,
      exitModalIsOpen: false,
    };
  };

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    const {textFields} = this.state;
    const {name, value} = e.target;

    this.setState({
      textFields: {
        ...textFields,
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeDate = (name: string, value: string) => {
    const {textFields} = this.state;
    this.setState({
      textFields: {
        ...textFields,
        [name]: {
          value,
          error: '',
        },
      },
      hasChanges: true,
    });
  };

  handleChangeSelect = (name: string, value: IOption) => {
    const {selectFields} = this.state;
    const {account} = this.props;

    if (name === 'entityTypeVariant') {
      this.setState({
        selectFields: {
          ...selectFields,
          entityTypeVariant: {
            value,
            error: '',
          },
          entityType:
            value.value === ENTITY_TYPES_VARIANTS[0].value
              ? {
                  value: ENTITY_TYPES.find(type => type.value === account.entityType) || null,
                  error: '',
                }
              : this.state.selectFields.entityType,
        },
        hasChanges: true,
      });
    } else {
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
    }
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

  handleLoadCodes = (code: 'naics' | 'sic' | 'mcc') => async (search, loadedOptions): Promise<ILoadOptionsResponse> => {
    let service;
    switch (code) {
      case 'naics':
        service = LocationsService.getNaicsCodes;
        break;
      case 'sic':
        service = LocationsService.getSicCodes;
        break;
      case 'mcc':
        service = LocationsService.getMccCodes;
        break;
    }

    const transport = await service({
      search,
      offset: loadedOptions.length,
    });

    if (!transport.success) {
      return {
        options: [],
        hasMore: false,
      };
    }

    const codes = transport.response.data.data.map(code => ({
      value: code.code,
      label: `${code.code} - ${code.description}`,
    }));

    return {
      options: codes,
      hasMore: codes.length === config.COMMON.itemsPerPage,
    };
  };

  handleReset = () => {
    this.setState(this.getInitialState(this.props.selectedLocationDetails));
  };

  isValid = (): boolean => {
    const {textFields} = this.state;

    const descriptionError = validateField(VP.location.profile.description, textFields.description.value);
    const employeesError = validateField(VP.location.profile.employees, textFields.employees.value);

    this.setState({
      textFields: {
        ...textFields,
        description: {
          ...textFields.description,
          error: descriptionError,
        },
        employees: {
          ...textFields.employees,
          error: employeesError,
        },
      },
    });

    return !(descriptionError || employeesError);
  };

  handleSave = async (): Promise<void> => {
    if (!this.isValid()) return;

    const {selectedLocationDetails} = this.props;
    const {textFields, selectFields} = this.state;

    await this.props.updateLocationProfile(selectedLocationDetails.profile.id, {
      naics: selectFields.naics.value ? selectFields.naics.value.value : null,
      sic: selectFields.sic.value ? selectFields.sic.value.value : null,
      mcc: selectFields.mcc.value ? selectFields.mcc.value.value : null,
      description: textFields.description.value,
      entityType: selectFields.entityType.value ? selectFields.entityType.value.value : null,
      locationType: selectFields.locationType.value ? selectFields.locationType.value.value : null,
      channelType: selectFields.channelType.value ? selectFields.channelType.value.value : null,
      locationOpenedAt: moment(textFields.openedDate.value).format('YYYY-MM-DD'),
      numberOfEmployees: parseInt(textFields.employees.value, 10),
      timeZone: selectFields.timeZone.value ? parseInt(selectFields.timeZone.value.value, 10) : null,
    });

    if (this.props.updateLocationError) return;

    this.setState({hasChanges: false});
  };

  render() {
    return (
      <ProfileTabLayout
        t={this.props.t}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        onChangeTextField={this.handleChangeTextField}
        onChangeDate={this.handleChangeDate}
        onChangeSelect={this.handleChangeSelect}
        onReset={this.handleReset}
        onSave={this.handleSave}
        selectedLocation={this.props.selectedLocation}
        hasChanges={this.state.hasChanges}
        updateLocationLoading={this.props.updateLocationLoading}
        onRequestChangeTab={this.handleRequestChangeTab}
        onChangeTabAnswer={this.handleChangeTabAnswer}
        exitModalIsOpen={this.state.exitModalIsOpen}
        onLoadCodes={this.handleLoadCodes}
      />
    );
  }
}

const ProfileTab = enhance(ProfileTabContainer, [withTranslation()]);
export default ProfileTab;
