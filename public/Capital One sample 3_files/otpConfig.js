define(['angular'], function(angular) {
  angular.module('OtpConfig', []).constant('OTP_CONFIG', {
    CHALLENGE_APP_BASE_URL: 'https://verified.capitalone.com/challenge.html',
    OTP_FEATURE_TO_CONFIG: {
      'ADD_EXT_ACCT' : {
        level: 2.5,
        environmentToClientName: {
          'GREEN': 'EASE_GREEN_ADDEXTACCT',
          'PROD': 'EASE_PROD_ADDEXTACCT'
        }
      },
      'CONVERT_EXT_ACCT' : {
        level: 2.5,
        environmentToClientName: {
          'GREEN': 'EASE_GREEN_CONVERTEXTACCT',
          'PROD': 'EASE_PROD_CONVERTEXTACCT'
        }
      },
      'VC_REVEAL_16_DIGIT': {
        level: 3,
        environmentToClientName: {
          'GREEN': 'EASE_GREEN_VIRTUALCARDS',
          'PROD': 'EASE_PROD_VIRTUALCARDS'
        }
      },
      'MASTERPASS_ADDRESS' : {
        level: 3,
        environmentToClientName: {
          'GREEN': 'EASE_GREEN_MASTERPASSADDRESS',
          'PROD': 'EASE_PROD_MASTERPASSADDRESS'
        }
      },
      'ACCT_SETUP': {
        level: 2.5,
        environmentToClientName: {
          'GREEN': 'EASE_GREEN_ACCTSETUP',
          'PROD': 'EASE_ACCTSETUP'
        }
      }
    }
  });
});
