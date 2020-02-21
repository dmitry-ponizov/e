import React from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import BehavioralTabLayout from 'pages/GroupsPage/parts/BehavioralTab/layout';
import FILTER_OPERATORS from 'constants/filterOperators';

interface IInjectedProps {
  account: IAccount;
  selectedGroup: IGroup;
  selectedGroupDetails: IGroupDetails;
  updateGroupLoading: boolean;
  updateGroupError: string;
  setActiveGroupTab: (activeGroupTab: GroupTabType) => void;
  clearErrors: () => void;
}

interface IState {
  filterFields: IFiltersFieldsState;
  hasChanges: boolean;
  exitModalIsOpen: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    selectedGroup: rootStore.groupsStore.selectedGroup!,
    selectedGroupDetails: rootStore.groupsStore.selectedGroupDetails!,
    updateGroupLoading: rootStore.groupsStore.updateGroupLoading,
    updateGroupError: rootStore.groupsStore.updateGroupError,
    setActiveGroupTab: rootStore.groupsStore.setActiveGroupTab,
    clearErrors: rootStore.groupsStore.clearErrors,
  }),
)
@observer
class BehavioralTabContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedGroupDetails);
  }

  requestedTab: GroupTabType | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedGroupDetails: IGroupDetails): IState => {
    return {
      filterFields: {
        totalSpend: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        highestSpend: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[5],
          error: '',
        },
        lowestSpend: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[4],
          error: '',
        },
        averageSpend: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[2],
          error: '',
        },
        totalTransaction: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastTransaction: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        // Net Promotor Score
        highestNPS: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lowestNPS: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastNPS: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        averageNPS: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        // Points
        totalPoints: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        currentPoints: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastReward: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        // Communication
        totalFeedback: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastFeedback: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        totalDisputes: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastDispute: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        totalMessages: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastMessage: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        // Content
        totalViews: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastView: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        totalLikes: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastLike: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        totalComments: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastComment: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        totalShares: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
        lastShare: {
          values: ['0', '0'],
          operator: FILTER_OPERATORS[0],
          error: '',
        },
      },

      hasChanges: false,
      exitModalIsOpen: false,
    };
  };

  handleInput = (operator: IOption, values: string[], name: string) => {
    const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

    if (!values.every(value => regex.test(value))) return;
    this.setState({
      filterFields: {
        ...this.state.filterFields,
        [name]: {
          operator,
          values,
          error: '',
        },
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
    if (!this.props.selectedGroupDetails) return;
    this.setState(this.getInitialState(this.props.selectedGroupDetails));
  };

  isValid = (): boolean => {
    return true;
  };

  handleSave = async (): Promise<void> => {
    if (!this.isValid()) return;

    // TODO: update functionality
  };

  render() {
    return (
      <BehavioralTabLayout
        t={this.props.t}
        filterFields={this.state.filterFields}
        onReset={this.handleReset}
        onSave={this.handleSave}
        selectedGroup={this.props.selectedGroup}
        hasChanges={this.state.hasChanges}
        updateGroupLoading={this.props.updateGroupLoading}
        onRequestChangeTab={this.handleRequestChangeTab}
        onChangeTabAnswer={this.handleChangeTabAnswer}
        exitModalIsOpen={this.state.exitModalIsOpen}
        onInput={this.handleInput}
      />
    );
  }
}

const BehavioralTab = enhance(BehavioralTabContainer, [withTranslation()]);
export default BehavioralTab;
