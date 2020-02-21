const MESSAGES = {
  userNotFound: 'Incorrect email address. Please check your email address and try again.',
  incorrectPassword: "The password that you've entered is incorrect. Please try again.",
  required: 'This field is required',
  maxLength: maxLength => `Maximum length is ${maxLength}`,
  greater: value => `Should be greater then ${value}`,
  less: value => `Should be less then ${value}`,
  validPhone: 'Please enter valid phone',
  validEmail: 'Please enter valid email address',
  validNumber: 'Please enter valid number',
  // TODO: remove passwordLength backup
  // passwordLength: 'Password should have at least 8 characters',
  passwordLength:
    'Must consist of minimum six characters, at least one uppercase letter, one lowercase letter and one number',
  zip: 'Please enter valid zip',
  passwordConfirm: 'Confirmation password is different',
  unknown: 'An unknown error occurred',
  noToken: 'Unable to login. Check, that email and password are correct',
  invalidPictureType: 'Only PNG or JPG are allowed.',
  invalidPictureSize: 'Maximum 10MB are allowed.',

  LOCATIONS: {
    updateSuccess: 'Location has been successfully saved.',
  },
  ACCOUNT: {
    updateSuccess: 'Account has been successfully saved.',
  },
  ADDRESS: {
    invalidAddress: 'Address is invalid',
    A1: "ZIP+4 not matched; address is invalid. (City/state/ZIP + street don't match.)",
    M1: 'Primary number (e.g., house number) is missing.',
    M3: 'Primary number (e.g., house number) is invalid.',
    N1:
      'Confirmed with missing secondary information; address is valid but it also needs a secondary number (apartment, suite, etc.).',
    P1: 'PO, RR, or HC box number is missing.',
    P3: 'PO, RR, or HC box number is invalid.',
  },
  CONTENT: {
    createSuccess: 'Content item has been successfully created.',
    updateSuccess: 'Content item has been successfully updated.',
    updateImageSuccess: 'Content item image has been successfully updated.',
    deleteSuccess: 'Content item has been successfully deleted.',
    singlePublishError: (name: string) => `Failed to publish ${name} content item.`,
    publishSuccess: (count: number) => `${count} content item(s) has been successfully published.`,
  },
  GROUPS: {
    createSuccess: 'Group has been successfully created.',
    updateSuccess: 'Group has been successfully updated.',
  },
  REWARDS: {
    updateSuccess: 'Reward has been successfully saved.',
    singlePublishError: (name: string) => `Failed to publish ${name} reward.`,
    publishSuccess: (count: number) => `${count} reward(s) has been successfully published.`,
  },
};

export default MESSAGES;
