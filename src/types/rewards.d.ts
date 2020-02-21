interface IReward {
  id: string;
  name: string;
  isActive: boolean;
}

interface ITargetGroup {
  name: string;
  id: string;
  businessId: string;
  priority: number;
}

interface IRewardLocation {
  id: string;
  name: string;
  businessId: string;
}

interface ICreateRewardRequestData {
  name: string;
  businessId: string;
}

interface IPublishRewardsRequestData {
  type: string;
  rewardDraftIds: string[];
}

interface IUpdateRewardData {
  locationId: string;
  name: string;
  reward: string | null;
  level: number | null;
  points: number | null;
  dollars: number | null;
  rules: string | null;
  groups: string[] | null;
}

interface IRewardDetails extends IReward {
  businessId: string | null;
  locationId: string;
  location: IRewardLocation | null;
  targetGroups: ITargetGroup[];
  publishStop: string | null;
  publishStart: string | null;
  reward: string | null;
  level: string | null;
  points: string | null;
  dollars: string | null;
  rules: string | null;
  picture: string | null;
}
