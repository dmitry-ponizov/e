import React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import GroupsPageLayout from 'pages/GroupsPage/layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import moment from 'moment';

const getRefreshDate = (): string => {
  const date = moment();
  return `${date.format('MMM D, YYYY')} at ${date.format('hh:mm A')}`;
};

interface IInjectedProps {
  activeGroupTab: GroupTabType;
  selectedGroup: IGroup | null;
  selectGroupLoading: boolean;
  selectedGroupDetails: IGroupDetails | null;
  getGroups: () => Promise<void>;
  getGroupsError: string;
  getGroupsLoading: boolean;
  clearErrors: () => void;
  refreshGroups: (businessID: string) => void;
  account: IAccount;
}

interface IState {
  initiated: boolean;
  lastTimeRefreshed: string;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    account: rootStore.authStore.account!,
    activeGroupTab: rootStore.groupsStore.activeGroupTab,
    selectedGroup: rootStore.groupsStore.selectedGroup,
    selectGroupLoading: rootStore.groupsStore.selectGroupLoading,
    selectedGroupDetails: rootStore.groupsStore.selectedGroupDetails,
    getGroups: rootStore.groupsStore.getGroups,
    getGroupsError: rootStore.groupsStore.getGroupsError,
    getGroupsLoading: rootStore.groupsStore.getGroupsLoading,
    clearErrors: rootStore.groupsStore.clearErrors,
    refreshGroups: rootStore.groupsStore.refreshGroups,
  }),
)
@observer
class GroupsPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      initiated: false,
      lastTimeRefreshed: getRefreshDate(),
    };
  }

  async componentDidMount() {
    await this.props.getGroups();
    this.setState({initiated: true});
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleRefreshGroups = () => {
    this.props.refreshGroups(this.props.account.businessId);
    this.setState({
      lastTimeRefreshed: getRefreshDate(),
    });
  };

  render() {
    return (
      <GroupsPageLayout
        t={this.props.t}
        activeGroupTab={this.props.activeGroupTab}
        selectGroupLoading={this.props.selectGroupLoading}
        selectedGroupDetails={this.props.selectedGroupDetails}
        initiated={this.state.initiated}
        onRefreshGroups={this.handleRefreshGroups}
        lastTimeRefreshed={this.state.lastTimeRefreshed}
      />
    );
  }
}

const GroupsPage = enhance(GroupsPageContainer, [withRouter, withTranslation()]);
export default GroupsPage;
