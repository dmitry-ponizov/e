import {action, observable} from 'mobx';
import getErrorsFromResponse from 'helpers/getErrorsFromResponse';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';
import RewardsService from '../services/RewardsService';
import {rewardsGetAdapterIn, rewardDetailsAdapterIn} from 'helpers/adapters/reward';

export class RewardsStore {
  @observable
  rewards: IReward[] = [];

  // MODALS -----------------------------------------------------------------------------------------------------------/
  @observable
  createModalIsActive = false;
  @observable
  deleteModalIsActive = false;
  @action
  toggleCreateModal = (value: boolean) => {
    this.createModalIsActive = value;
  };
  @action
  toggleDeleteModal = (value: boolean, rewardsId?: string[]) => {
    if (rewardsId) {
      this.chosenRewards = rewardsId;
    }
    this.deleteModalIsActive = value;
  };

  // GET REWARDS ----------------------------------------------------------------------------------------------------/
  @observable
  getRewardsLoading = false;
  @observable
  getRewardsError = '';
  @action
  getRewardsStart = () => {
    this.getRewardsLoading = true;
    this.getRewardsError = '';
  };
  @action
  getRewards = async (params?: IPaginationRequestParams): Promise<void> => {
    this.getRewardsStart();

    const transport = await RewardsService.getRewards(params);

    if (!transport.success) {
      this.getRewardsLoading = false;
      this.getRewardsError = getErrorsFromResponse(transport);
      return Toast.show(this.getRewardsError, {type: 'danger'});
    }

    this.rewards = rewardsGetAdapterIn(transport);

    if (this.rewards.length) {
      this.selectReward(this.rewards[0]);
    }

    this.getRewardsLoading = false;
  };

  // SELECT REWARD --------------------------------------------------------------------------------------------------/
  @observable
  selectedReward: IReward | null = null;
  selectedRewardDetails: IRewardDetails | null = null;
  @observable
  selectRewardLoading = false;
  @observable
  selectRewardError = '';
  @action
  selectRewardStart = (reward: IReward) => {
    this.selectedReward = reward;
    this.selectedRewardDetails = null;
    this.selectRewardLoading = true;
    this.selectRewardError = '';
  };
  @action
  selectReward = async (reward: IReward): Promise<void> => {
    this.selectRewardStart(reward);

    const transport = await RewardsService.getRewardDetails(reward.id, {join: ['location', 'targetGroup']});

    // prevent errors when user reselect fast
    if (!this.selectedReward || this.selectedReward.id !== reward.id) return;

    if (!transport.success) {
      this.selectRewardLoading = false;
      this.selectRewardError = getErrorsFromResponse(transport);
      return Toast.show(this.selectRewardError, {type: 'danger'});
    }

    this.selectedRewardDetails = rewardDetailsAdapterIn(transport);
    this.selectRewardLoading = false;
  };

  // CREATE REWARD --------------------------------------------------------------------------------------------------/
  @observable
  createRewardLoading = false;
  @observable
  createRewardError = '';
  @action
  createRewardStart = () => {
    this.createRewardLoading = true;
    this.createRewardError = '';
  };
  @action
  createReward = async (data: ICreateRewardRequestData): Promise<void> => {
    this.createRewardStart();

    const transport = await RewardsService.createReward(data);

    if (!transport.success) {
      this.createRewardLoading = false;
      this.createRewardError = getErrorsFromResponse(transport);
      return Toast.show(this.createRewardError, {type: 'danger'});
    }

    const newCreatedReward = transport.response.data;

    this.rewards = [...this.rewards, newCreatedReward];
    this.createModalIsActive = false;
    this.createRewardLoading = false;

    this.selectReward(newCreatedReward);
  };

  // DELETE REWARDS --------------------------------------------------------------------------------------------------/
  @observable
  deleteRewardLoading = false;
  @observable
  deleteRewardError = '';
  @observable
  chosenRewards: string[] = [];
  @action
  deleteRewardsStart = () => {
    this.deleteRewardLoading = true;
    this.deleteRewardError = '';
  };
  @action
  deleteRewards = async (): Promise<void> => {
    if (!this.chosenRewards.length) return;

    this.deleteRewardsStart();

    const transport = await RewardsService.deleteRewards(this.chosenRewards);

    if (!transport.success) {
      this.deleteRewardLoading = false;
      this.deleteRewardError = getErrorsFromResponse(transport);
      return Toast.show(this.deleteRewardError, {type: 'danger'});
    }

    this.rewards = this.rewards.filter(reward => !this.chosenRewards.includes(reward.id));
    this.chosenRewards = [];
    this.deleteModalIsActive = false;
    this.deleteRewardLoading = false;

    if (this.rewards.length) {
      this.selectReward(this.rewards[0]);
    }
  };

  // UPDATE REWARD --------------------------------------------------------------------------------------------------/
  @observable
  updateRewardLoading = false;
  @observable
  updateRewardError = '';
  @action
  updateRewardStart = () => {
    this.updateRewardLoading = true;
    this.updateRewardError = '';
  };
  @action
  updateReward = async (rewardId: string, data: IUpdateRewardData): Promise<void> => {
    this.updateRewardStart();

    const transport = await RewardsService.updateReward(rewardId, data);

    if (!transport.success) {
      this.updateRewardLoading = false;
      this.updateRewardError = getErrorsFromResponse(transport);
      return Toast.show(this.updateRewardError, {type: 'danger'});
    }

    this.selectedRewardDetails = rewardDetailsAdapterIn(transport);

    this.updateRewardLoading = false;
    Toast.show(MESSAGES.REWARDS.updateSuccess, {type: 'success'});
  };

  // UPDATE REWARD LOGO -----------------------------------------------------------------------------------
  @observable
  updateRewardLogoLoading = false;
  @observable
  updateRewardLogoError = '';
  @action
  updateRewardLogoStart = () => {
    this.updateRewardLogoLoading = true;
    this.updateRewardLogoError = '';
  };
  @action
  updateRewardLogo = async (id: string, file: File | null): Promise<void> => {
    this.updateRewardLogoStart();

    const transport = await RewardsService.updateRewardLogo(id, file);

    if (!transport.success) {
      this.updateRewardLogoLoading = false;
      this.updateRewardLogoError = getErrorsFromResponse(transport);
      return Toast.show(this.updateRewardLogoError, {type: 'danger'});
    }

    this.updateRewardLogoLoading = false;
    Toast.show(MESSAGES.REWARDS.updateSuccess, {type: 'success'});
  };

  //PUBLISH REWARD -----------------------------------------------------------------------------------
  @observable
  startPublishRewardLoading = false;
  @observable
  stopPublishRewardLoading = false;
  @observable
  publishRewardError = '';
  @action
  publishRewardsStart = ({type}) => {
    this.publishRewardError = '';
    type === 'start' ? (this.startPublishRewardLoading = true) : (this.stopPublishRewardLoading = true);
  };
  @action
  publishRewards = async (data: IPublishRewardsRequestData): Promise<void> => {
    this.publishRewardsStart(data);

    const transport = await RewardsService.publishRewards(data);

    if (!transport.success) {
      this.stopPublishRewardLoading = false;
      this.startPublishRewardLoading = false;
      this.publishRewardError = getErrorsFromResponse(transport);
      return Toast.show(this.publishRewardError, {type: 'danger'});
    }

    const responsedRewards = transport.response.data;

    this.rewards = this.rewards.map(reward => {
      if (data.rewardDraftIds.indexOf(reward.id) === -1) return reward;
      const updatedReward = responsedRewards.find(publishedReward => publishedReward.id === reward.id);

      if (!updatedReward) {
        Toast.show(MESSAGES.REWARDS.singlePublishError(reward.name), {type: 'danger', duration: 10000});
        return reward;
      }

      return {
        ...reward,
        isActive: data.type === 'start',
        publishStop: updatedReward.publishStop,
        publishStart: updatedReward.publishStart,
      };
    });

    if (this.selectedRewardDetails && this.selectedRewardDetails.id === data.rewardDraftIds[0]) {
      this.selectedRewardDetails = {
        ...this.selectedRewardDetails,
        isActive: data.type === 'start',
        publishStop: responsedRewards[0].publishStop,
        publishStart: responsedRewards[0].publishStart,
      };
    }

    this.startPublishRewardLoading = false;
    this.stopPublishRewardLoading = false;

    Toast.show(MESSAGES.REWARDS.publishSuccess(responsedRewards.length), {type: 'success'});
  };

  clearErrors = () => {
    this.getRewardsError = '';
    this.createRewardError = '';
    this.deleteRewardError = '';
    this.updateRewardError = '';
  };
}

const rewardsStore = new RewardsStore();
export default rewardsStore;
