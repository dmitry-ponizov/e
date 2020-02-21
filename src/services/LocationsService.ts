import config from 'constants/config';
import {RequestMethod} from 'services/httpRequestMethods';
import transport, {ITransportResponse} from './transport';
import firebase from 'services/firebase';

export interface ICreateLocationRequestData {
  name: string;
  businessId: string;
}

export interface IUpdateLocationContactRequestData {
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  businessEmail: string | null;
  phone: string | null;
  phoneType: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface IUpdateLocationProfileRequestData {}

export interface IUpdateLocationProcessingInfoRequestData {
  frontEndProcessor: string | null;
  backEndProcessor: string | null;
  name: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
}

interface IGetCodesRequestParams {
  search: string;
  offset: number;
}

const LocationsService = {
  getLocations: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/locations`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params,
    });
  },

  createLocation: async (data: ICreateLocationRequestData): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/locations`, {
      method: RequestMethod.POST,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  deleteLocations: async (locationIds: string[]): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/locations/bulk`, {
      method: RequestMethod.DELETE,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data: {
        bulk: locationIds,
      },
    });
  },

  getLocationBusiness: async (locationId: string): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/businesses`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        filter: `locationId||eq||${locationId}`,
      },
    });
  },

  updateLocationBusiness: async (
    businessId: string,
    data: IUpdateLocationContactRequestData | IUpdateLocationProfileRequestData,
  ): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/businesses/${businessId}`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  updateLocationContactLogo: async (id: string, logo: File | null): Promise<ITransportResponse> => {
    const formData = new FormData();
    formData.append('picture', logo || '');

    return transport(`${config.API.URL}/location/rest/businesses/${id}/file`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  },

  getLocationProcessingInfo: async (locationId: string): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/processings`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        filter: `locationId||eq||${locationId}`,
      },
    });
  },

  updateLocationProcessingInfoLogo: async (id: string, logo: File | null): Promise<ITransportResponse> => {
    const formData = new FormData();
    formData.append('picture', logo || '');

    return transport(`${config.API.URL}/location/rest/processings/${id}/file`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  },

  updateLocationProcessingInfo: async (
    processingInfoId: string,
    data: IUpdateLocationProcessingInfoRequestData,
  ): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/processings/${processingInfoId}`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  getLocationOperations: async (locationId: string): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/operations`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        filter: `locationId||eq||${locationId}`,
      },
    });
  },

  updateLocationOperations: async (data: Partial<ILocationOperation>[]): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/operations/bulk`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data: {
        bulk: data,
      },
    });
  },

  getLocationIntegrations: async (locationId: string): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/integrations`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        filter: `locationId||eq||${locationId}`,
        sort: 'socialChannel,ASC',
      },
    });
  },

  updateLocationIntegrations: async (data: Partial<ILocationIntegration>[]): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/integrations/bulk`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data: {
        bulk: data,
      },
    });
  },

  getNaicsCodes: async (params: IGetCodesRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/naics-codes`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        per_page: config.COMMON.itemsPerPage,
        offset: params.offset,
        filter: params.search ? `code||starts||${params.search}` : '',
        sort: 'code,ASC',
      },
    });
  },

  getMccCodes: async (params: IGetCodesRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/mcc-codes`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        per_page: config.COMMON.itemsPerPage,
        offset: params.offset,
        filter: params.search ? `code||starts||${params.search}` : '',
        sort: 'code,ASC',
      },
    });
  },

  getSicCodes: async (params: IGetCodesRequestParams): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/location/rest/sic-codes`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params: {
        per_page: config.COMMON.itemsPerPage,
        offset: params.offset,
        filter: params.search ? `code||starts||${params.search}` : '',
        sort: 'code,ASC',
      },
    });
  },
};

export default LocationsService;
