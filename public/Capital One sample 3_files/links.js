define(['angular'], function(angular) {
  angular.module('TaxLinks', []).constant('TaxLinks', {
    retail: 'https://banking.capitalone.com/olb-web/taxForms',
    '360': 'https://secure.capitalone360.com/myaccount/banking/tax_forms_landing_page.vm'
  });
});
