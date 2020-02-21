import authStore, {AuthStore} from './AuthStore';
import rewardsStore, {RewardsStore} from './RewardsStore';
import locationsStore, {LocationsStore} from 'stores/LocationsStore';
import groupsStore, {GroupsStore} from 'stores/GroupsStore';
import contentStore, {ContentStore} from 'stores/ContentStore';
import feedsStore, {FeedsStore} from 'stores/FeedStore';
import messagesStore, {MessagesStore} from 'stores/MessagesStore';
import customersStore, {CustomersStore} from 'stores/CustomersStore';
import simpleRouterStore, { SimpleRouterStore} from 'stores/SimpleRouterStore';

export interface IRootStore {
  authStore: AuthStore;
  locationsStore: LocationsStore;
  rewardsStore: RewardsStore;
  groupsStore: GroupsStore;
  contentStore: ContentStore;
  feedsStore: FeedsStore;
  messagesStore: MessagesStore;
  customersStore: CustomersStore;
}

export interface IExtensionRootStore {
  authStore: AuthStore;
  feedsStore: FeedsStore;
  messagesStore: MessagesStore;
  simpleRouterStore: SimpleRouterStore;
}

export const merchantStores = {
  authStore,
  locationsStore,
  rewardsStore,
  groupsStore,
  contentStore,
  feedsStore,
  messagesStore,
  customersStore,
};

export const extensionStores = {
  authStore,
  feedsStore,
  messagesStore,
  simpleRouterStore,
};
