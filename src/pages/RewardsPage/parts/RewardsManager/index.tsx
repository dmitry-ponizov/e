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
import styles from 'pages/RewardsPage/parts/RewardsManager/styles.module.scss';

interface ITableItem {
  id: string;
  tableData: [string, JSX.Element | string];
}

interface IInjectedProps {
  rewards: IReward[];
  selectedReward: IRewardDetails | null;
  selectReward: (reward: IReward) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
  toggleDeleteModal: (value: boolean, rewardId: string[]) => void;
  publishReward: (data: IPublishRewardsRequestData) => void;
}

type SortType = 'name' | 'customers';

interface IState {
  searchQuery: string;
  selectedRewards: string[];
  sortAsc: boolean;
  sortType: SortType;
  activeRewardId: string | null;
}

@inject((rootStore: IRootStore) => ({
  rewards: rootStore.rewardsStore.rewards,
  selectedRewardDetails: rootStore.rewardsStore.selectedRewardDetails,
  selectedReward: rootStore.rewardsStore.selectedReward,
  selectReward: rootStore.rewardsStore.selectReward,
  toggleCreateModal: rootStore.rewardsStore.toggleCreateModal,
  toggleDeleteModal: rootStore.rewardsStore.toggleDeleteModal,
  publishReward: rootStore.rewardsStore.publishRewards,
}))
@observer
class RewardsManagerBase extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedRewards: [],
      activeRewardId: null,
      sortAsc: true,
      sortType: 'name',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.rewards !== prevProps.rewards) {
      this.setState({selectedRewards: []});
    }
  }

  handleCreateReward = () => {
    this.props.toggleCreateModal(true);
  };

  handleChangeSearch = searchQuery => {
    this.setState({
      searchQuery,
      selectedRewards: [],
    });
  };

  handleChooseItems = (selectedRewards: string[]) => {
    this.setState({selectedRewards});
  };

  handleChangeSort = (sortType: SortType) => {
    this.setState({
      sortType,
      sortAsc: this.state.sortType === sortType ? !this.state.sortAsc : true,
    });
  };

  handleSetActiveReward = (rewardId: string) => {
    const reward: IReward = this.props.rewards.find(reward => reward.id === rewardId)!;
    this.props.selectReward(reward);
  };

  handleDeleteReward = () => {
    console.log('123', this.state.selectedRewards);
    this.props.toggleDeleteModal(true, this.state.selectedRewards);
  };

  filterRewards = memoizeOne((rewards, searchQuery) => {
    return this.props.rewards.filter(reward => {
      return reward.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    });
  });

  sortRewards = memoizeOne((rewards: IReward[], sortType, sortAsc): IReward[] => {
    return [...rewards].sort((a, b) => {
      if (sortType === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortType === '') {
        return sortAsc
          ? a.isActive === b.isActive
            ? 0
            : a.isActive
            ? -1
            : 1
          : a.isActive === b.isActive
          ? 0
          : a.isActive
          ? 1
          : -1;
      }
      return 0;
    });
  });

  handlePublishReward = (type: string) => {
    this.props.publishReward({
      type: type,
      rewardDraftIds: this.state.selectedRewards,
    });
  };

  render() {
    const {selectedRewards, sortAsc, sortType, searchQuery} = this.state;
    const {t, selectedReward, rewards} = this.props;
    const filteredRewards = this.filterRewards(rewards, searchQuery);
    const sortedRewards = this.sortRewards(filteredRewards, sortType, sortAsc);

    const getDataForTableManager: ITableItem[] = sortedRewards.map(reward => {
      return {
        id: reward.id,
        tableData: [
          reward.name,
          <div key={reward.id} className={`${styles.status}${reward.isActive ? ' ' + styles.active : ''}`} />,
        ],
      };
    });

    return (
      <ItemManager
        searchPlaceholder={t('Find reward')}
        onChangeSearch={this.handleChangeSearch}
        onCreate={this.handleCreateReward}
        actions={
          <>
            <div onClick={() => this.handlePublishReward('start')}>
              <Icon name="play" />
            </div>
            <div onClick={() => this.handlePublishReward('stop')}>
              <Icon name="stop" />
            </div>
            <div onClick={this.handleDeleteReward}>
              <Icon name="delete" />
            </div>
          </>
        }
      >
        <TableManager
          data={getDataForTableManager}
          choosedData={selectedRewards}
          currentItem={selectedReward && selectedReward.id}
          sortType={sortType}
          sortAsc={sortAsc}
          columns={[t('Name'), t('Status')]}
          noResultFoundMsg={t('No rewards found.')}
          onChangeSort={this.handleChangeSort}
          onChooseItems={this.handleChooseItems}
          onSetActiveItem={this.handleSetActiveReward}
        />
      </ItemManager>
    );
  }
}

const RewardsManager = enhance(RewardsManagerBase, [withRouter, withTranslation()]);
export default RewardsManager;
