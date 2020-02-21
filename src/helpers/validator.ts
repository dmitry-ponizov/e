import {Validator} from 'class-validator';

const validator = new Validator();

export enum VALID_TYPE {
  Required = 'Required',
  ValidEmail = 'ValidEmail',
  ValidPhone = 'ValidPhone',
  ValidNumber = 'ValidNumber',
  MinLength = 'MinLength',
  MaxLength = 'MaxLength',
  Match = 'Match',
  Identical = 'Identical',
  Greater = 'Greater',
  Less = 'Less',
}

interface IValidationPattern {
  type: VALID_TYPE;
  error: string | ((value?: string) => string);
  maxLength?: number;
  minLength?: number;
  regex?: RegExp;
  identical?: string;
  greater?: number;
  less?: number;
}

const validatePattern = (pattern: IValidationPattern, value: string): string => {
  const error = typeof pattern.error === 'function' ? pattern.error() : pattern.error;
  switch (pattern.type) {
    case VALID_TYPE.Required:
      return value.trim() ? '' : typeof pattern.error === 'function' ? pattern.error() : pattern.error;
    case VALID_TYPE.ValidEmail:
      return validator.isEmail(value) ? '' : typeof pattern.error === 'function' ? pattern.error() : pattern.error;
    case VALID_TYPE.ValidPhone:
      return validator.isPhoneNumber(value, 'ZZ') ? '' : error;
    case VALID_TYPE.MinLength:
      return pattern.minLength && value.length >= pattern.minLength ? '' : error;
    case VALID_TYPE.MaxLength:
      return pattern.maxLength && value.length <= pattern.maxLength ? '' : error;
    case VALID_TYPE.Match:
      return pattern.regex && pattern.regex.test(value) ? '' : error;
    case VALID_TYPE.Identical:
      return pattern.identical && pattern.identical === value ? '' : error;
    case VALID_TYPE.ValidNumber:
      return !isNaN(+value) ? '' : error;
    case VALID_TYPE.Greater:
      return +value >= pattern.greater! ? '' : error;
    case VALID_TYPE.Less:
      return +value <= pattern.less! ? '' : error;
  }
};

const validateField = (patterns: IValidationPattern[], value: string): string => {
  let error = '';
  patterns.every(pattern => {
    error = validatePattern(pattern, value);
    return !error;
  });
  return error;
};

export default validateField;
