import config from 'constants/config';
import {RequestMethod} from 'services/httpRequestMethods';
import transport, {ITransportResponse} from './transport';
import firebase from 'services/firebase';

interface ICreateContentItemRequestData {
  name: string;
  locationId: string;
  isLogoEnabled: boolean;
  targetGroupLinks: {targetGroupId: string}[];
}

interface IUpdateContentItemRequestData {
  name: string;
  locationId: string;
  isLogoEnabled: boolean;
  targetGroupLinks: {targetGroupId: string}[];
}

interface IPublishContentRequestData {
  contentDraftIds: string[];
}

const ContentService = {
  getContent: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    console.log(`Bearer ${await firebase.getToken()}`);
    return transport(`${config.API.URL}/content/rest/content-drafts/`, {
      method: RequestMethod.GET,
      headers: {Authorization: `Bearer ${await firebase.getToken()}`},
      params,
    });
  },

  getContentDetails: async (contentItemId: string, params: IPaginationRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/content/rest/content-drafts/${contentItemId}`, {
      method: RequestMethod.GET,
      headers: {Authorization: `Bearer ${await firebase.getToken()}`},
      params,
    });
  },

  updateContent: async (contentItemId: string, data: IUpdateContentItemRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/content/rest/content-drafts/${contentItemId}`, {
      method: RequestMethod.PATCH,
      headers: {Authorization: `Bearer ${await firebase.getToken()}`},
      data,
    });
  },

  updateContentItemImage: async (id: string, image: File | null): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/content/rest/content-drafts/${id}/file`, {
      method: RequestMethod.PUT,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
      data: new FormData().append('image', image || ''),
    });
  },

  createContentItem: async (data: ICreateContentItemRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/content/rest/content-drafts`, {
      method: RequestMethod.POST,
      headers: {Authorization: `Bearer ${await firebase.getToken()}`},
      data,
    });
  },

  deleteContentItems: async (data: string[]): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/content/rest/content-drafts/bulk`, {
      method: RequestMethod.DELETE,
      headers: {Authorization: `Bearer ${await firebase.getToken()}`},
      data: {bulk: data},
    });
  },

  publishContent: async (isPublished: boolean, data: IPublishContentRequestData): Promise<ITransportResponse> => {
    const url = isPublished ? 'stop-publishing' : 'publish';
    return transport(`${config.API.URL}/content/content-drafts/${url}`, {
      method: RequestMethod.POST,
      headers: {Authorization: `Bearer ${await firebase.getToken()}`},
      data,
    });
  },
};

export default ContentService;
