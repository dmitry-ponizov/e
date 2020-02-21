import {action, observable} from 'mobx';
import FeedsService, {
  ICreateFeedRequestData,
} from '../services/FeedsServices';

export class FeedsStore {
  @observable
  feeds: IFeed[] = [];

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
  toggleDeleteModal = (value: boolean, feed?: IFeed) => {
    if (feed) {
      this.feedToDelete = feed;
    }
    this.deleteModalIsActive = value;
  };

  // GET FEEDS ----------------------------------------------------------------------------------------------------/
  @observable
  getFeedsLoading = false;
  @observable
  getFeedsError = '';
  @action
  getFeedsStart = () => {
    this.getFeedsLoading = true;
    this.getFeedsError = '';
  };
  @action
  getFeeds = async (params?: IPaginationRequestParams): Promise<void> => {
    this.getFeedsStart();
    const transport = await FeedsService.getFeeds(params);
    if (!transport.success) {
      this.getFeedsLoading = false;
      this.getFeedsError = transport.message;
      return;
    }
    this.feeds = transport.response.data.data;
    this.getFeedsLoading = false;
  };

  // SELECT REWARD --------------------------------------------------------------------------------------------------/
  @observable
  selectedFeed: IFeed | null = null;
  selectedFeedDetails: IFeedDetails | null = null;
  @observable
  selectFeedLoading = false;
  @observable
  selectFeedError = '';
  @action
  selectFeedStart = (feed: IFeed) => {
    this.selectedFeed = feed;
    this.selectedFeedDetails = null;
    this.selectFeedLoading = true;
    this.selectFeedError = '';
  };
  @action
  selectFeed = async (feed: IFeed): Promise<void> => {
    this.selectFeedStart(feed);

    const transport = await FeedsService.getFeedDetails(feed.id);

    // prevent errors when user reselect fast
    if (!this.selectedFeed || this.selectedFeed.id !== feed.id) return;

    if (!transport.success) {
      this.selectFeedLoading = false;
      this.selectFeedError = transport.message;
      return;
    }

    this.selectedFeedDetails = {
      ...feed,
      // TODO: get details according reward model
      ...transport.response.data,
    };
    this.selectFeedLoading = false;
  };

  // CREATE FEED --------------------------------------------------------------------------------------------------/
  @observable
  createFeedLoading = false;
  @observable
  createFeedError = '';
  @action
  createFeedStart = () => {
    this.createFeedLoading = true;
    this.createFeedError = '';
  };
  @action
  createFeed = async (data: ICreateFeedRequestData): Promise<void> => {
    this.createFeedStart();
    const transport = await FeedsService.createFeed(data);
    if (!transport.success) {
      this.createFeedLoading = false;
      this.createFeedError = transport.message;
      return;
    }
    this.feeds = [...this.feeds, transport.response!.data];
    // TODO: select new reward
    this.createModalIsActive = false;
    this.createFeedLoading = false;
  };

  // DELETE FEED --------------------------------------------------------------------------------------------------/
  @observable
  deleteFeedLoading = false;
  @observable
  deleteFeedError = '';
  @observable
  feedToDelete: IFeed | null = null;
  @action
  deleteFeedStart = () => {
    this.deleteFeedLoading = true;
    this.deleteFeedError = '';
  };
  @action
  deleteFeed = async (): Promise<void> => {
    if (!this.feedToDelete) return;
    this.deleteFeedStart();
    const transport = await FeedsService.deleteFeed(this.feedToDelete.id);
    if (!transport.success) {
      this.deleteFeedLoading = false;
      this.deleteFeedError = transport.message;
      return;
    }
    this.feeds = this.feeds.filter(location => location.id !== this.feedToDelete!.id);
    this.feedToDelete = null;
    this.deleteModalIsActive = false;
    this.deleteFeedLoading = false;
  };

  // UPDATE FEED --------------------------------------------------------------------------------------------------/
  @observable
  updateFeedLoading = false;
  @observable
  updateFeedError = '';

  clearErrors = () => {
    this.getFeedsError = '';
    this.createFeedError = '';
    this.deleteFeedError = '';
    this.updateFeedError = '';
  };
}

const feedsStore = new FeedsStore();
export default feedsStore;
