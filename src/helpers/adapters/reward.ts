import {ITransportResponse} from 'services/transport';

export const rewardsGetAdapterIn = (transport: ITransportResponse): IReward[] => {
  return transport.response.data.map(reward => {
    const {id, isActive, name} = reward;
    return {
      id,
      name,
      isActive,
    };
  });
};

export const rewardDetailsAdapterIn = (transport: ITransportResponse): IRewardDetails => {
  const {data} = transport.response;

  return {
    id: data.id,
    name: data.name,
    // TODO: isActive field optional in B-End?
    isActive: !!data.isActive,
    businessId: data.businessId,
    locationId: data.locationId,
    picture: data.picture,
    dollars: data.dollars,
    points: data.points,
    level: data.level,
    reward: data.reward,
    rules: data.rules,
    publishStart: data.publishStart,
    publishStop: data.publishStop,
    location: data.location || null,
    // TODO: targetGroups field optional in B-End?
    targetGroups: data.targetGroups || [],
  };
};
