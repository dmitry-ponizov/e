import transport, {ITransportResponse} from './transport';
import firebase from 'services/firebase';
import config from 'constants/config';
import {RequestMethod} from './httpRequestMethods';

const GroupsService = {
  getGroups: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/group/rest/target-groups`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params,
    });
  },

  getGroupFilters: async (groupId: string): Promise<ITransportResponse> => {
    // TODO: rewrite params (join)
    return transport(`${config.API.URL}/group/rest/target-groups/${groupId}?join=filters`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
    });
  },

  getGroupsTotalCustomers: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/group/rest/customer-profile-in-target-group`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params,
    });
  },

  createGroup: async (data: IGroupCreateRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/group/rest/target-groups`, {
      method: RequestMethod.POST,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  updateGroup: async (groupID: string, data: IGroupUpdateRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/group/rest/target-groups/${groupID}`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  refreshGroup: async (businessId: string): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/group/target-groups/refresh/${businessId}`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
    });
  },

  deleteGroups: async (data: string[]): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/group/rest/target-groups/bulk`, {
      method: RequestMethod.DELETE,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data: {
        bulk: data,
      },
    });
  },
};

export default GroupsService;
