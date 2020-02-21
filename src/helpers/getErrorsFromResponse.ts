import {ITransportResponse} from 'services/transport';

const mapCode = {};

const getErrorsFromResponse = (response: ITransportResponse): string => {
  if (!response.response || !response.response.data) return response.message;

  const messageArray = response.response.data.message;
  if (typeof messageArray === 'string') return response.response.data.message;
  if (!messageArray || !Array.isArray(messageArray)) return response.message;
  return messageArray.reduce((errors, message) => {
    if (!message.constraints) return `${errors} ${response.message}`;
    const code = `error_${message.property}_${Object.keys(message.constraints)[0]}`;
    return `${errors} ${mapCode[code] || '[' + code + ']'}`;
  }, '');
};

export default getErrorsFromResponse;
