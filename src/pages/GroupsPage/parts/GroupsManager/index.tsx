import React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import Icon from 'components/Icon';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {RouteComponentProps, withRouter} from 'react-router';
import enhance from 'helpers/enhance';
import memoizeOne from 'memoize-one';
import ItemManager from 'components/ItemManager';
import TableManager from 'components/TableManager';

interface ITableItem {
  id: string;
  tableData: [string, string];
}

type SortType = 'name' | 'customers';

interface IInjectedProps {
  groups: IGroup[];
  selectedGroup: IGroup | null;
  selectGroup: (group: IGroup) => Promise<void>;
  choosenGroups: string[];
  toggleCreateModal: (value: boolean) => void;
  toggleDeleteModal: (value: boolean, groupId: string[]) => void;
}

interface IState {
  searchQuery: string;
  selectedGroups: string[];
  sortAsc: boolean;
  sortType: SortType;
  activeGroupId: string | null;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  groups: rootStore.groupsStore.groups,
  selectedGroup: rootStore.groupsStore.selectedGroup,
  selectGroup: rootStore.groupsStore.selectGroup,
  choosenGroups: rootStore.groupsStore.chosenGroups,
  toggleCreateModal: rootStore.groupsStore.toggleCreateModal,
  toggleDeleteModal: rootStore.groupsStore.toggleDeleteModal,
}))
@observer
class GroupsManagerBase extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedGroups: [],
      activeGroupId: null,
      sortAsc: true,
      sortType: 'name',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.groups !== prevProps.groups) {
      this.setState({selectedGroups: []});
    }
  }

  handleCreateGroup = () => {
    this.props.toggleCreateModal(true);
  };

  handleChangeSearch = searchQuery => {
    this.setState({
      searchQuery,
      selectedGroups: [],
    });
  };

  handleChooseItems = (selectedGroups: string[]) => {
    this.setState({selectedGroups});
  };

  handleChangeSort = (sortType: SortType) => {
    this.setState({
      sortType,
      sortAsc: this.state.sortType === sortType ? !this.state.sortAsc : true,
    });
  };

  handleSetActiveGroup = (groupId: string) => {
    this.props.selectGroup(this.props.groups.find(group => group.id === groupId)!);
  };

  handleDeleteGroups = () => {
    this.props.toggleDeleteModal(true, this.state.selectedGroups);
  };

  filterGroups = memoizeOne((groups, searchQuery) => {
    return this.props.groups.filter(group => {
      return group.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    });
  });

  sortGroups = memoizeOne((groups: IGroup[], sortType, sortAsc) => {
    return [...groups].sort((a, b) => {
      if (sortType === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortType === '') {
        return sortAsc ? +a.customers - +b.customers : +b.customers - +a.customers;
      }
      return 0;
    });
  });

  render() {
    const {t, groups, selectedGroup} = this.props;
    const {selectedGroups, sortAsc, sortType, searchQuery} = this.state;

    const filteredGroups = this.filterGroups(groups, searchQuery);
    const sortedGroups = this.sortGroups(filteredGroups, sortType, sortAsc);

    const getDataForTableManager: ITableItem[] = sortedGroups.map(group => ({
      id: group.id,
      tableData: [group.name, group.customers],
    }));

    return (
      <ItemManager
        searchPlaceholder={t('Find group')}
        onChangeSearch={this.handleChangeSearch}
        onCreate={this.handleCreateGroup}
        actions={
          <div onClick={this.handleDeleteGroups}>
            <Icon name="delete" />
          </div>
        }
      >
        <TableManager
          data={getDataForTableManager}
          choosedData={selectedGroups}
          currentItem={selectedGroup!.id}
          sortType={sortType}
          sortAsc={sortAsc}
          columns={[t('Group'), t('Associated Customers')]}
          noResultFoundMsg={t('No groups found.')}
          onChangeSort={this.handleChangeSort}
          onChooseItems={this.handleChooseItems}
          onSetActiveItem={this.handleSetActiveGroup}
        />
      </ItemManager>
    );
  }
}

const GroupsManager = enhance(GroupsManagerBase, [withRouter, withTranslation()]);
export default GroupsManager;
