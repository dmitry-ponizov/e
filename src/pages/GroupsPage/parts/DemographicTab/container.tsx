import React, {ChangeEvent} from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import DemographicTabLayout from 'pages/GroupsPage/parts/DemographicTab/layout';
import GENDER_TYPES from 'constants/genderTypes';
import RELATIONSHIP_TYPES from 'constants/relationshipTypes';
import HOME_TYPES from 'constants/homeTypes';
import CHILDREN_TYPES from 'constants/childrenTypes';
import EDUCATION_TYPES from 'constants/educationTypes';
import EMPLOYMENT_TYPES from 'constants/employmentTypes';
import ETHNIC_TYPES from 'constants/ethnicTypes';
import INCOME_TYPES from 'constants/groupsIncomeTypes';
import {bornYears} from 'constants/date';
import {US_STATES_SHORT} from 'constants/usStates';
import validateField from 'helpers/validator';
import VP from 'constants/validationPatterns';
import firebase from 'services/firebase';
import config from 'constants/config';

const selectFieldsKeys: string[] = [
  'gender',
  'relationship',
  'children',
  'home',
  'yearOfBirth',
  'education',
  'employment',
  'ethnic',
  'income',
];

const multiSelectFieldsKeys: string[] = ['region', 'postalCode'];

interface IInjectedProps {
  selectedGroup: IGroup;
  selectedGroupDetails: IGroupDetails;
  updateGroupLoading: boolean;
  updateGroupError: string;
  updateGroup: (updatingGroupData: IGroupField[]) => Promise<void>;
  setActiveGroupTab: (activeGroupTab: GroupTabType) => void;
  clearErrors: () => void;
}

interface IState {
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  multiSelectFields: IMultiSelectFieldsState;
  hasChanges: boolean;
  exitModalIsOpen: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedGroup: rootStore.groupsStore.selectedGroup!,
    selectedGroupDetails: rootStore.groupsStore.selectedGroupDetails!,
    updateGroupLoading: rootStore.groupsStore.updateGroupLoading,
    updateGroup: rootStore.groupsStore.updateGroup,
    updateGroupError: rootStore.groupsStore.updateGroupError,
    setActiveGroupTab: rootStore.groupsStore.setActiveGroupTab,
    clearErrors: rootStore.groupsStore.clearErrors,
  }),
)
@observer
class DemographicTabContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedGroupDetails);
  }

  requestedTab: GroupTabType | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedGroupDetails: IGroupDetails): IState => {
    const state: IState = {
      textFields: {
        distanceFrom: {
          value: '',
          error: '',
        },
        distanceTo: {
          value: '',
          error: '',
        },
      },
      selectFields: {
        gender: {
          value: null,
          error: '',
        },
        relationship: {
          value: null,
          error: '',
        },
        children: {
          value: null,
          error: '',
        },
        home: {
          value: null,
          error: '',
        },
        yearOfBirth: {
          value: null,
          error: '',
        },
        education: {
          value: null,
          error: '',
        },
        employment: {
          value: null,
          error: '',
        },
        ethnic: {
          value: null,
          error: '',
        },
        income: {
          value: null,
          error: '',
        },
      },
      multiSelectFields: {
        region: {
          values: [],
          error: '',
        },
        postalCode: {
          values: [],
          error: '',
        },
      },
      checkboxFields: {
        distance: true,
      },
      hasChanges: false,
      exitModalIsOpen: false,
    };

    selectedGroupDetails.filters.forEach(filter => {
      switch (filter.name) {
        case 'distance':
          state.textFields.distanceFrom.value = `${filter.conditions.between!.from}`;
          state.textFields.distanceTo.value = `${filter.conditions.between!.to}`;
          break;

        case 'region':
          state.multiSelectFields.region.values = filter.conditions.in!.map(state => `${state}`) || [];
          break;

        case 'postalCode':
          state.multiSelectFields.postalCode.values =
            filter.conditions.in!.map(code => `${code}`) || US_STATES_SHORT[0];
          break;

        case 'gender':
          state.selectFields.gender.value =
            GENDER_TYPES.find(gender => {
              return gender.value === filter.conditions.eq;
            }) || GENDER_TYPES[0];
          break;

        case 'relationship':
          state.selectFields.relationship.value =
            RELATIONSHIP_TYPES.find(relationship => {
              return relationship.value === filter.conditions.eq;
            }) || RELATIONSHIP_TYPES[0];
          break;

        case 'children':
          state.selectFields.children.value =
            CHILDREN_TYPES.find(children => {
              return children.value === filter.conditions.eq;
            }) || CHILDREN_TYPES[0];
          break;

        case 'home':
          state.selectFields.home.value =
            HOME_TYPES.find(home => {
              return home.value === filter.conditions.eq;
            }) || HOME_TYPES[0];
          break;

        case 'yearOfBirth':
          state.selectFields.yearOfBirth.value =
            bornYears.find(year => {
              return year.value === `${filter.conditions.eq}`;
            }) || bornYears[0];
          break;

        case 'education':
          state.selectFields.education.value =
            EDUCATION_TYPES.find(education => {
              return education.value === filter.conditions.eq;
            }) || EDUCATION_TYPES[0];
          break;

        case 'employment':
          state.selectFields.employment.value =
            EMPLOYMENT_TYPES.find(employment => {
              return employment.value === filter.conditions.eq;
            }) || EMPLOYMENT_TYPES[0];
          break;

        case 'ethnic':
          state.selectFields.ethnic.value =
            ETHNIC_TYPES.find(ethnic => {
              return ethnic.value === filter.conditions.eq;
            }) || ETHNIC_TYPES[0];
          break;

        case 'income':
          state.selectFields.income.value =
            INCOME_TYPES.find(income => {
              return income.value === filter.conditions.eq;
            }) || INCOME_TYPES[0];
          break;
      }
    });
    return state;
  };

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

  handleChangeCheckboxFields = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      checkboxFields: {
        ...this.state.checkboxFields,
        [e.target.name]: !this.state.checkboxFields[e.target.name],
      },
      hasChanges: true,
    });
  };

  handleChangeSelectFields = (name: string, value: IOption) => {
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

  handleChangeMultiselectField = (name: string, values: string[]) => {
    this.setState({
      multiSelectFields: {
        ...this.state.multiSelectFields,
        [name]: {
          values,
          error: '',
        },
        postalCode:
          name === 'region'
            ? {
                values: [],
                error: '',
              }
            : this.state.multiSelectFields.postalCode,
      },
      hasChanges: true,
    });
  };

  handleRequestChangeTab = (tab: GroupTabType) => {
    if (this.state.hasChanges) {
      this.requestedTab = tab;
      this.setState({exitModalIsOpen: true});
    } else {
      this.props.setActiveGroupTab(tab);
    }
  };

  handleChangeTabAnswer = async (answer: ExitAnswer): Promise<void> => {
    switch (answer) {
      case 'continue':
        if (this.requestedTab) {
          this.props.setActiveGroupTab(this.requestedTab);
        }
        break;
      case 'cancel':
        this.setState({exitModalIsOpen: false});
        this.requestedTab = null;
        break;
      case 'save-continue':
        this.setState({exitModalIsOpen: false});
        await this.handleSave();
        if (!this.props.updateGroupError && this.requestedTab) {
          this.props.setActiveGroupTab(this.requestedTab);
        }
        break;
    }
  };

  handleReset = () => {
    this.setState(this.getInitialState(this.props.selectedGroupDetails));
  };

  handleSave = async (): Promise<void> => {
    if (!this.isValid()) return;
    const filters: IGroupField[] = [
      {
        name: 'distance',
        conditions: {
          between: {
            from: +this.state.textFields.distanceFrom.value,
            to: +this.state.textFields.distanceTo.value,
          },
        },
      },
    ];

    selectFieldsKeys.forEach(key => {
      filters.push({
        name: key,
        conditions: {
          eq:
            key === 'yearOfBirth'
              ? +this.state.selectFields.yearOfBirth.value!.value
              : this.state.selectFields[key].value!.value,
        },
      });
    });

    multiSelectFieldsKeys.forEach(key => {
      filters.push({
        name: key,
        conditions: {
          in: this.state.multiSelectFields[key].values,
        },
      });
    });

    await this.props.updateGroup(filters);

    if (!this.props.updateGroupError) {
      this.setState({hasChanges: false});
    }
  };

  isValid = (): boolean => {
    const {textFields} = this.state;

    const distanceFromError = validateField(
      VP.groups.distanceFrom(textFields.distanceTo.value),
      textFields.distanceFrom.value,
    );
    const distanceToError = validateField(VP.groups.distanceTo, textFields.distanceTo.value);

    this.setState({
      textFields: {
        ...textFields,
        distanceFrom: {
          ...textFields.distanceFrom,
          error: distanceFromError,
        },
        distanceTo: {
          ...textFields.distanceTo,
          error: distanceToError,
        },
      },
    });

    return !(distanceFromError || distanceToError);
  };

  zipCodesCursor: string | null = null;
  onLoadZipCodes = async () => {
    const {data, cursor} = await firebase.getZipCodes(this.state.multiSelectFields.region.values, this.zipCodesCursor);
    this.zipCodesCursor = cursor;
    return {
      options: data,
      hasMore: data.length === config.COMMON.itemsPerPage,
    };
  };

  render() {
    return (
      <DemographicTabLayout
        t={this.props.t}
        textFields={this.state.textFields}
        selectFields={this.state.selectFields}
        checkboxFields={this.state.checkboxFields}
        multiSelectFields={this.state.multiSelectFields}
        onChangeTextField={this.handleChangeTextField}
        onChangeSelectField={this.handleChangeSelectFields}
        onChangeCheckboxField={this.handleChangeCheckboxFields}
        onChangeMultiselectField={this.handleChangeMultiselectField}
        onReset={this.handleReset}
        onSave={this.handleSave}
        selectedGroup={this.props.selectedGroup}
        hasChanges={this.state.hasChanges}
        exitModalIsOpen={this.state.exitModalIsOpen}
        updateGroupLoading={this.props.updateGroupLoading}
        onRequestChangeTab={this.handleRequestChangeTab}
        onChangeTabAnswer={this.handleChangeTabAnswer}
        onLoadZipCodes={this.onLoadZipCodes}
      />
    );
  }
}

const DemographicTab = enhance(DemographicTabContainer, [withTranslation()]);
export default DemographicTab;
