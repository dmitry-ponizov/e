import config from 'constants/config';
import {RequestMethod} from 'services/httpRequestMethods';
import transport, {ITransportResponse} from './transport';

interface IValidateAddressRequestParams {
  street: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

const CommonService = {
  suggestAddress: (searchQuery: string): Promise<ITransportResponse> => {
    return transport(config.SMARTY_STREETS_CONFIG.suggestUrl, {
      method: RequestMethod.GET,
      params: {
        prefix: searchQuery,
        'auth-id': config.SMARTY_STREETS_CONFIG.authId,
      },
    });
  },

  validateAddress: (params: IValidateAddressRequestParams): Promise<ITransportResponse> => {
    return transport(config.SMARTY_STREETS_CONFIG.validateUrl, {
      method: RequestMethod.GET,
      params: {
        ...params,
        'auth-id': config.SMARTY_STREETS_CONFIG.authId,
      },
    });
  },
};

export default CommonService;
