import React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import RewardsPageLayout from 'pages/RewardsPage/layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';

interface IInjectedProps {
  selectedReward: IReward | null;
  selectedRewardDetails: IRewardDetails | null;
  selectRewardLoading: boolean;
  getRewards: (params: IPaginationRequestParams) => Promise<void>;
  updateReward: (businessId: string, data: IUpdateRewardData) => void;
  getRewardsError: string;
  getRewardsLoading: boolean;
  clearErrors: () => void;
}

interface IState {
  initiated: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedReward: rootStore.rewardsStore.selectedReward,
    selectedRewardDetails: rootStore.rewardsStore.selectedRewardDetails,
    selectRewardLoading: rootStore.rewardsStore.selectRewardLoading,
    getRewards: rootStore.rewardsStore.getRewards,
    getRewardsError: rootStore.rewardsStore.getRewardsError,
    getRewardsLoading: rootStore.rewardsStore.getRewardsLoading,
    updateReward: rootStore.rewardsStore.updateReward,
    clearErrors: rootStore.rewardsStore.clearErrors,
  }),
)
@observer
class RewardsPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      initiated: false,
    };
  }

  async componentDidMount() {
    await this.props.getRewards({sort: ['name,ASC']});
    this.setState({initiated: true});
  }

  render() {
    return (
      <RewardsPageLayout
        t={this.props.t}
        selectedRewardDetails={this.props.selectedRewardDetails}
        selectRewardLoading={this.props.selectRewardLoading}
        initiated={this.state.initiated}
      />
    );
  }
}

const RewardsPage = enhance(RewardsPageContainer, [withRouter, withTranslation()]);
export default RewardsPage;
