import MESSAGES from 'constants/messages';

const getValidationAddressError = (results: any): string => {
  if (!results.length) return MESSAGES.ADDRESS.invalidAddress;
  const code = results[0].analysis.dpv_footnotes;
  if (code.indexOf('A1') > -1) return MESSAGES.ADDRESS.A1;
  if (code.indexOf('M1') > -1) return MESSAGES.ADDRESS.M1;
  if (code.indexOf('M3') > -1) return MESSAGES.ADDRESS.M3;
  if (code.indexOf('N1') > -1) return MESSAGES.ADDRESS.N1;
  if (code.indexOf('P1') > -1) return MESSAGES.ADDRESS.P1;
  return '';
};

export default getValidationAddressError;
