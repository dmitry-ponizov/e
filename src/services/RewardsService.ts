import transport, {ITransportResponse} from './transport';
import config from 'constants/config';
import firebase from 'services/firebase';
import {RequestMethod} from 'services/httpRequestMethods';

const RewardsService = {
  getRewards: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/reward/rest/reward-drafts`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        ...params,
      },
    });
  },

  createReward: async (data: ICreateRewardRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/reward/rest/reward-drafts`, {
      method: RequestMethod.POST,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  deleteRewards: async (data: string[]): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/reward/rest/reward-drafts/bulk`, {
      method: RequestMethod.DELETE,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data: {
        bulk: data,
      },
    });
  },

  getRewardDetails: async (rewardId: string, params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/reward/rest/reward-drafts/${rewardId}`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        id: `rewardId||eq||${rewardId}`,
        ...params,
      },
    });
  },

  updateReward: async (rewardId: string, data: IUpdateRewardData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/reward/rest/reward-drafts/${rewardId}`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  updateRewardLogo: async (id: string, logo: File | null): Promise<ITransportResponse> => {
    const formData = new FormData();
    formData.append('picture', logo || '');

    return transport(`${config.API.URL}/reward/rest/reward-drafts/${id}/file`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  },

  publishRewards: async (data: IPublishRewardsRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/reward/rest/reward-drafts/action`, {
      method: RequestMethod.POST,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },
};

export default RewardsService;
