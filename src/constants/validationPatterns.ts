import {VALID_TYPE} from 'helpers/validator';
import MESSAGES from 'constants/messages';

const VP = {
  login: {
    email: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.ValidEmail,
        error: MESSAGES.validEmail,
      },
    ],
    password: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MinLength,
        minLength: 8,
        error: MESSAGES.passwordLength,
      },
    ],
  },
  forgotPassword: {
    email: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.ValidEmail,
        error: MESSAGES.validEmail,
      },
    ],
  },
  signUp: {
    firstName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 10,
        error: MESSAGES.maxLength(10),
      },
    ],
    lastName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 10,
        error: MESSAGES.maxLength(10),
      },
    ],
    email: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.ValidEmail,
        error: MESSAGES.validEmail,
      },
    ],
    confirmPassword: originalPass => [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.Identical,
        identical: originalPass,
        error: MESSAGES.passwordConfirm,
      },
    ],
    password: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.Match,
        regex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50})/,
        error: MESSAGES.passwordLength,
      },
    ],
    address1: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 20,
        error: MESSAGES.maxLength(20),
      },
    ],
    address2: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 20,
        error: MESSAGES.maxLength(20),
      },
    ],
    countryState: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
    ],
    city: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
    ],
    zip: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 5,
        error: MESSAGES.maxLength(5),
      },
    ],
  },
  account: {
    logo: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
    ],
    userFirstName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 20,
        error: MESSAGES.maxLength(20),
      },
    ],
    userLastName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 20,
        error: MESSAGES.maxLength(20),
      },
    ],
    businessLegalName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 200,
        error: MESSAGES.maxLength(200),
      },
    ],
    businessWorkingName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 200,
        error: MESSAGES.maxLength(200),
      },
    ],
    jobTitle: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 20,
        error: MESSAGES.maxLength(20),
      },
    ],
    businessFirstName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 100,
        error: MESSAGES.maxLength(100),
      },
    ],
    businessLastName: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 100,
        error: MESSAGES.maxLength(100),
      },
    ],
    businessEmail: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.ValidEmail,
        error: MESSAGES.validEmail,
      },
    ],
    phone: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.ValidPhone,
        error: MESSAGES.validPhone,
      },
    ],
    entityType: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
    ],
    address1: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 200,
        error: MESSAGES.maxLength(200),
      },
    ],
    address2: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 200,
        error: MESSAGES.maxLength(200),
      },
    ],
    city: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 100,
        error: MESSAGES.maxLength(100),
      },
    ],
    state: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 100,
        error: MESSAGES.maxLength(100),
      },
    ],
    zipCode: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 5,
        error: MESSAGES.maxLength(5),
      },
    ],
  },
  location: {
    processingInfo: {
      frontEndProcessor: [
        {
          type: VALID_TYPE.Required,
          error: MESSAGES.required,
        },
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 15,
          error: MESSAGES.maxLength(15),
        },
      ],
      backEndProcessor: [
        {
          type: VALID_TYPE.Required,
          error: MESSAGES.required,
        },
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 15,
          error: MESSAGES.maxLength(15),
        },
      ],
      name: [
        {
          type: VALID_TYPE.Required,
          error: MESSAGES.required,
        },
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 15,
          error: MESSAGES.maxLength(15),
        },
      ],
      city: [
        {
          type: VALID_TYPE.Required,
          error: MESSAGES.required,
        },
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 100,
          error: MESSAGES.maxLength(100),
        },
      ],
      state: [
        {
          type: VALID_TYPE.Required,
          error: MESSAGES.required,
        },
      ],
      zipCode: [
        {
          type: VALID_TYPE.Required,
          error: MESSAGES.required,
        },
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 10,
          error: MESSAGES.maxLength(10),
        },
      ],
    },
    contact: {
      firstName: [
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 100,
          error: MESSAGES.maxLength(100),
        },
      ],
      title: [
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 20,
          error: MESSAGES.maxLength(20),
        },
      ],
      lastName: [
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 100,
          error: MESSAGES.maxLength(100),
        },
      ],
      phone: [
        {
          type: VALID_TYPE.ValidPhone,
          error: MESSAGES.validPhone,
        },
      ],
      email: [
        {
          type: VALID_TYPE.ValidEmail,
          error: MESSAGES.validEmail,
        },
      ],
    },
    profile: {
      description: [
        {
          type: VALID_TYPE.MaxLength,
          maxLength: 100,
          error: MESSAGES.maxLength(100),
        },
      ],
      employees: [
        {
          type: VALID_TYPE.Less,
          less: 10000,
          error: MESSAGES.less(10000),
        },
      ],
    },
  },
  groups: {
    distanceFrom: to => [
      {
        type: VALID_TYPE.ValidNumber,
        error: MESSAGES.validNumber,
      },
      {
        type: VALID_TYPE.Greater,
        greater: 0,
        error: MESSAGES.greater(0),
      },
      // TODO: delete one LESS type?
      {
        type: VALID_TYPE.Less,
        less: 1000,
        error: MESSAGES.less(1000),
      },
      {
        type: VALID_TYPE.Less,
        less: to,
        error: MESSAGES.less,
      },
    ],
    distanceTo: [
      {
        type: VALID_TYPE.ValidNumber,
        error: MESSAGES.validNumber,
      },
      {
        type: VALID_TYPE.Greater,
        greater: 1,
        error: MESSAGES.greater(1),
      },
      {
        type: VALID_TYPE.Less,
        less: 1500,
        error: MESSAGES.less(1500),
      },
    ],
  },
  reward: {
    name: [
      {
        type: VALID_TYPE.Required,
        error: MESSAGES.required,
      },
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 20,
        error: MESSAGES.maxLength(20),
      },
    ],
    dollars: [
      {
        type: VALID_TYPE.ValidNumber,
        error: MESSAGES.validNumber,
      },
      {
        type: VALID_TYPE.Greater,
        greater: 1,
        error: MESSAGES.greater(1),
      },
      {
        type: VALID_TYPE.Less,
        less: 1000,
        error: MESSAGES.less(1000),
      },
    ],
    points: [
      {
        type: VALID_TYPE.ValidNumber,
        error: MESSAGES.validNumber,
      },
      {
        type: VALID_TYPE.Greater,
        greater: 1,
        error: MESSAGES.greater(1),
      },
      {
        type: VALID_TYPE.Less,
        less: 1000,
        error: MESSAGES.less(1000),
      },
    ],
    level: [
      {
        type: VALID_TYPE.ValidNumber,
        error: MESSAGES.validNumber,
      },
      {
        type: VALID_TYPE.Greater,
        greater: 1,
        error: MESSAGES.greater(1),
      },
      {
        type: VALID_TYPE.Less,
        less: 1000,
        error: MESSAGES.less(1000),
      },
    ],
    reward: [
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 50,
        error: MESSAGES.maxLength(50),
      },
    ],
    rules: [
      {
        type: VALID_TYPE.MaxLength,
        maxLength: 50,
        error: MESSAGES.maxLength(50),
      },
    ],
  },
};

export default VP;
