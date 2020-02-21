
import {ITransportResponse} from './transport';
import {AxiosResponse} from 'axios';

export interface ICreateFeedRequestData {
  name: string;
  merchantProfileId: string;
}

const FeedsService = {
  getFeeds: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    // return transport(`${config.API.URL}/location/rest/locations`, {
    //   method: RequestMethod.GET,
    //   headers: {
    //     Authorization: `Bearer ${await firebase.getToken()}`,
    //   },
    //   params,
    // });

    return {
      response: {
        data: {
          data: [
            {
              id: '1',
              name: 'First Feed',
              location: '1st location',
              group: '1st group',
            },
            {
              id: '2',
              name: 'Second Fedd',
              location: '2nd location',
              group: '2nd group',
            },
            {
              id: '3',
              name: 'Third Feed',
              location: '3rd location',
              group: '3rd group',
            },
          ],
        },
      } as AxiosResponse,
      success: true,
      message: 'ok',
    };
  },

  createFeed: async (data: ICreateFeedRequestData): Promise<ITransportResponse> => {
    // return transport(`${config.API.URL}/location/rest/rewards`, {
    //   method: RequestMethod.POST,
    //   headers: {
    //     Authorization: `Bearer ${await firebase.getToken()}`,
    //   },
    //   data,
    // });
    return {
      response: {
        data: {
          test: 'test,',
        },
      } as AxiosResponse,
      success: true,
      message: 'ok',
    };
  },

  deleteFeed: async (feedId: string): Promise<ITransportResponse> => {
    // return transport(`${config.API.URL}/location/rest/rewards/${rewardId}`, {
    //   method: RequestMethod.DELETE,
    //   headers: {
    //     Authorization: `Bearer ${await firebase.getToken()}`,
    //   },
    // });
    return {
      response: {
        data: {
          test: 'test,',
        },
      } as AxiosResponse,
      success: true,
      message: 'ok',
    };
  },

  getFeedDetails: async (feedId: string): Promise<ITransportResponse> => {
    // return transport(`${config.API.URL}/location/rest/businesses`, {
    //   method: RequestMethod.GET,
    //   headers: {
    //     Authorization: `Bearer ${await firebase.getToken()}`,
    //   },
    //   params: {
    //     filter: `locationId||eq||${rewardId}`,
    //   },
    // });
    return {
      response: {
        data: {
          location: 'testLocation1',
          group: 'testGroup1',
        },
      } as AxiosResponse,
      success: true,
      message: 'ok',
    };
  },
};

export default FeedsService;
