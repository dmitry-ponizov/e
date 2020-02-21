import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';

// eslint-disable-next-line
const qs = require('qs');

export interface ITransportResponse {
  response: AxiosResponse;
  success: boolean;
  message: string;
}

const transport = (url: string, config: AxiosRequestConfig): Promise<ITransportResponse> => {
  return axios(url, {...config, paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})})
    .then(response => ({
      response,
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
    }))
    .catch(error => ({
      response: error.response,
      success: false,
      message: error.message,
    }));
};

export default transport;
