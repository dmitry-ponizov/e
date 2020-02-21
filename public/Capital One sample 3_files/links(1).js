define(['angular'], function(angular) {
  angular.module('LogOutLinks', []).constant('LogOutLinks', {
    url360Summary: 'https://secure.capitalone360.com/myaccount/ease/logout_ease.htm?erdr=%2FaccountSummary',
    logoutUrl: {
      US : 'https://www.capitalone.com/sign-out/?service=e',
      CANADA: {
        EN: 'https://www.capitalone.ca/online-banking/logout/?state=logout',
        FR: 'https://fr.capitalone.ca/services-bancaires-en-ligne/déconnexion/mj9j/?state=logout'
      }
    },
    eSICUrl: 'https://verified.capitalone.com/sic-ui/#/esignin?Product=ENTERPRISE'
  })
})
