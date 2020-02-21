import config from 'constants/config';
import {RequestMethod} from 'services/httpRequestMethods';
import transport, {ITransportResponse} from './transport';
import firebase from 'services/firebase';
import {AxiosResponse} from 'axios';

const CustomersService = {
  getCustomers: async (params?: IPaginationRequestParams): Promise<ITransportResponse> => {
    transport(`${config.API.URL}/customer/rest/customers`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      params,
    });

    return {
      response: {
        data: {
          data: [
            {
              id: '1',
              name: 'Customer 1',
            },
            {
              id: '2',
              name: 'Customer 2',
            },
            {
              id: '3',
              name: 'Customer 3',
            },
          ],
        },
      } as AxiosResponse,
      success: true,
      message: 'ok',
    };
  },
};

export default CustomersService;
