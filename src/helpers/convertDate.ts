import config from 'constants/config';
import moment from 'moment';

export const getValuesFromString = (strValue: string): Date[] => {
  const result: Date[] = [];
  const split = strValue.split(config.COMMON.dateSplitter);
  if (split[0]) {
    result.push(moment(split[0], config.COMMON.dateFormat).toDate());
  }
  if (split[1]) {
    result.push(moment(split[1], config.COMMON.dateFormat).toDate());
  }
  return result;
};

export const getStringFromValues = (values: Date[]): string => {
  let result = '';
  if (values[0]) {
    result += moment(values[0]).format(config.COMMON.dateFormat);
  }
  if (values[1]) {
    result += config.COMMON.dateSplitter;
    result += moment(values[1]).format(config.COMMON.dateFormat);
  }
  return result;
};
