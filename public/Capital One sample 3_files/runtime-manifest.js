define('easeWebRuntimeManifest', [], function() {
  // Backwards compatible utility functions generated on babeljs.io (using preset env for old IE)
  // in order to make merging the different RequireJS configs easier/more readable.
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(
          Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          })
        );
      }
      ownKeys.forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    }
    return target;
  }

  /**
   * NOTE: All the relative paths below are based on the final version of this file which gets manipulated
   * during the build process and outputted to one-build/dist/ease-web
   */
  const requireJSConfig = {
    paths: {
      /**
       * PLATFORM - Polyfills and shims
       */
      'custom-elements-native-shim': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/custom-elements/src/native-shim',
      'custom-elements-polyfill': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/custom-elements/custom-elements.min',
      'ease-web-polyfills': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/polyfills',
      'ease-web-es2015-polyfills': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/es2015-polyfills',
      /**
       * PLATFORM - 1st and 3rd party code
       */
      'ease-web-platform': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/main',
      'ease-web-platform-styles': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/styles',
      rxjs: '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/rxjs/rxjs.umd.min',
      tslib: '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/tslib/node_modules/tslib/tslib',
      '@angular/core': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/core/bundles/core.umd.min',
      '@angular/animations': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/animations/bundles/animations.umd.min',
      '@angular/animations/browser': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/animations/bundles/animations-browser.umd.min',
      '@angular/compiler': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/compiler/bundles/compiler.umd.min',
      '@angular/forms': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/forms/bundles/forms.umd.min',
      '@angular/router': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/router/bundles/router.umd.min',
      '@angular/common': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/common/bundles/common.umd.min',
      '@angular/common/http': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/common/bundles/common-http.umd.min',
      '@angular/platform-browser': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/platform-browser/bundles/platform-browser.umd.min',
      '@angular/platform-browser-dynamic':
        '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min',
      '@angular/platform-browser/animations':
        '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/platform-browser/bundles/platform-browser-animations.umd.min',
      '@angular/elements': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/elements/bundles/elements.umd.min',
      '@ngrx/store': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/store/bundles/store.umd.min',
      '@ngrx/effects': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/effects/bundles/effects.umd.min',
      '@ngneat/transloco': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/transloco/bundles/ngneat-transloco.umd.min',
      '@ngneat/transloco-utils': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/transloco-utils/bundles/ngneat-transloco-utils.umd.min',
      '@ngneat/transloco-locale':
        '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/transloco-locale/bundles/ngneat-transloco-locale.umd.min',
      flat: '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/flat/node_modules/flat/index',
      'is-buffer': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/is-buffer/node_modules/is-buffer/index',
      '@c1-ease/shared/singleton-services':
        '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/c1-ease-shared-singleton-services/c1-ease-shared-singleton-services.umd.min',
      '@c1-ease/shared-components':
        '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/c1-ease-shared-components/c1-ease-shared-components.umd.min',
      '@angular/cdk': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk.umd.min',
      '@angular/cdk/a11y': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-a11y.umd.min',
      '@angular/cdk/accordion': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-accordion.umd.min',
      '@angular/cdk/bidi': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-bidi.umd.min',
      '@angular/cdk/coercion': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-coercion.umd.min',
      '@angular/cdk/collections': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-collections.umd.min',
      '@angular/cdk/drag-drop': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-drag-drop.umd.min',
      '@angular/cdk/keycodes': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-keycodes.umd.min',
      '@angular/cdk/layout': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-layout.umd.min',
      '@angular/cdk/observers': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-observers.umd.min',
      '@angular/cdk/overlay': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-overlay.umd.min',
      '@angular/cdk/platform': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-platform.umd.min',
      '@angular/cdk/portal': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-portal.umd.min',
      '@angular/cdk/scrolling': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-scrolling.umd.min',
      '@angular/cdk/stepper': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-stepper.umd.min',
      '@angular/cdk/table': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-table.umd.min',
      '@angular/cdk/text-field': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-text-field.umd.min',
      '@angular/cdk/tree': '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/cdk/bundles/cdk-tree.umd.min'
    },
    shim: {
      'custom-elements-polyfill': {
        deps: ['custom-elements-native-shim']
      },
      'ease-web-polyfills': {
        deps: window.__EASE_ES2015_POLYFILLS_REQUIRED__ ? ['ease-web-es2015-polyfills'] : []
      },
      'ease-web-platform': {
        /**
         * We set this global property using a script tag which uses the nomodule attribute in the index.html
         *
         * This allows us to save modern browsers from downloading general polyfills they don't need, and is an
         * adaptation of the native solution in the Angular CLI.
         */
        deps: window.__EASE_ES2015_POLYFILLS_REQUIRED__
          ? ['custom-elements-polyfill', 'ease-web-platform-styles', 'ease-web-es2015-polyfills', 'ease-web-polyfills']
          : ['custom-elements-polyfill', 'ease-web-platform-styles', 'ease-web-polyfills']
      },
      flat: {
        deps: ['is-buffer']
      }
    },
    packages: [
      {
        name: 'flat',
        location: '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/flat/node_modules/flat',
        main: 'index'
      },
      {
        name: 'is-buffer',
        location: '../../../ease-web/ease-web-platform-de6855678d12464c68f7f5538eaa08ba6bdee821/assets/umds/is-buffer/node_modules/is-buffer',
        main: 'index'
      }
    ]
  };

  /**
   * ADDITIONAL ENTRY-POINTS
   *
   * NOTE: These paths are auto-generated and added here by the create-entry-point schematic
   */
  const entryPointPaths = {
    'ease-web-autoloan-carpay-catchup':
      '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-carpay-catchup/ease-web-autoloan-carpay-catchup.umd',
    'ease-web-autoloan-loan-details':
      '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-loan-details/ease-web-autoloan-loan-details.umd',
    'ease-web-autoloan-paperless': '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-paperless/ease-web-autoloan-paperless.umd',
    'ease-web-autoloan-payment': '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-payment/ease-web-autoloan-payment.umd',
    'ease-web-autoloan-payment-details':
      '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-payment-details/ease-web-autoloan-payment-details.umd',
    'ease-web-autoloan-payoff-letter':
      '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-payoff-letter/ease-web-autoloan-payoff-letter.umd',
    'ease-web-autoloan-root': '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-root/ease-web-autoloan-root.umd',
    'ease-web-autoloan-shared-state':
      '../../../ease-web/ease-web-autoloan-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-autoloan-shared-state/ease-web-autoloan-shared-state.umd',
    'ease-web-bank-entry-point': '../../../ease-web/ease-web-bank-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-bank-entry-point/ease-web-bank-entry-point.umd',
    'ease-web-card-account-details': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-account-details/ease-web-card-account-details.umd',
    'ease-web-card-account-users': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-account-users/ease-web-card-account-users.umd',
    'ease-web-card-accounts-link-accounts':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-accounts-link-accounts/ease-web-card-accounts-link-accounts.umd',
    'ease-web-card-balance-tracker': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-balance-tracker/ease-web-card-balance-tracker.umd',
    'ease-web-card-c1-detected-fraud':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-c1-detected-fraud/ease-web-card-c1-detected-fraud.umd',
    'ease-web-card-change-address': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-change-address/ease-web-card-change-address.umd',
    'ease-web-card-change-card-image':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-change-card-image/ease-web-card-change-card-image.umd',
    'ease-web-card-change-payment-due-date':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-change-payment-due-date/ease-web-card-change-payment-due-date.umd',
    'ease-web-card-close-account': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-close-account/ease-web-card-close-account.umd',
    'ease-web-card-documents': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-documents/ease-web-card-documents.umd',
    'ease-web-card-download-transactions':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-download-transactions/ease-web-card-download-transactions.umd',
    'ease-web-card-income-update': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-income-update/ease-web-card-income-update.umd',
    'ease-web-card-lock-card': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-lock-card/ease-web-card-lock-card.umd',
    'ease-web-card-make-a-payment-cancel-payment':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-make-a-payment-cancel-payment/ease-web-card-make-a-payment-cancel-payment.umd',
    'ease-web-card-manage-account-users':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-manage-account-users/ease-web-card-manage-account-users.umd',
    'ease-web-card-manage-account-users-add':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-manage-account-users-add/ease-web-card-manage-account-users-add.umd',
    'ease-web-card-manage-account-users-l2':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-manage-account-users-l2/ease-web-card-manage-account-users-l2.umd',
    'ease-web-card-one-time-payment': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-one-time-payment/ease-web-card-one-time-payment.umd',
    'ease-web-card-paperless': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-paperless/ease-web-card-paperless.umd',
    'ease-web-card-payments-autopay': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-payments-autopay/ease-web-card-payments-autopay.umd',
    'ease-web-card-payments-shared': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-payments-shared/ease-web-card-payments-shared.umd',
    'ease-web-card-product-offer': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-product-offer/ease-web-card-product-offer.umd',
    'ease-web-card-rewards-tier-tracker':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-rewards-tier-tracker/ease-web-card-rewards-tier-tracker.umd',
    'ease-web-card-rewards-transactions':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-rewards-transactions/ease-web-card-rewards-transactions.umd',
    'ease-web-card-shared-components':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-shared-components/ease-web-card-shared-components.umd',
    'ease-web-card-shared-state': '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-shared-state/ease-web-card-shared-state.umd',
    'ease-web-card-transactions-grid':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-transactions-grid/ease-web-card-transactions-grid.umd',
    'ease-web-card-travel-notification':
      '../../../ease-web/ease-web-card-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-card-travel-notification/ease-web-card-travel-notification.umd',
    'ease-web-commerce-consumer-virtual-numbers':
      '../../../ease-web/ease-web-commerce-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-commerce-consumer-virtual-numbers/ease-web-commerce-consumer-virtual-numbers.umd',
    'ease-web-commerce-virtual-numbers':
      '../../../ease-web/ease-web-commerce-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-commerce-virtual-numbers/ease-web-commerce-virtual-numbers.umd',
    'ease-web-core-account-linking': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-linking/ease-web-core-account-linking.umd',
    'ease-web-core-account-nickname': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-nickname/ease-web-core-account-nickname.umd',
    'ease-web-core-account-reorder': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-reorder/ease-web-core-account-reorder.umd',
    'ease-web-core-account-setup': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-setup/ease-web-core-account-setup.umd',
    'ease-web-core-account-setup-auto-pay':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-setup-auto-pay/ease-web-core-account-setup-auto-pay.umd',
    'ease-web-core-account-setup-paperless':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-setup-paperless/ease-web-core-account-setup-paperless.umd',
    'ease-web-core-account-setup-widget':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-setup-widget/ease-web-core-account-setup-widget.umd',
    'ease-web-core-account-summary': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-summary/ease-web-core-account-summary.umd',
    'ease-web-core-account-summary-error-message':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-account-summary-error-message/ease-web-core-account-summary-error-message.umd',
    'ease-web-core-add-payment': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-add-payment/ease-web-core-add-payment.umd',
    'ease-web-core-anniversary': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-anniversary/ease-web-core-anniversary.umd',
    'ease-web-core-choose-how-you-pay':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-choose-how-you-pay/ease-web-core-choose-how-you-pay.umd',
    'ease-web-core-contact-info': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-contact-info/ease-web-core-contact-info.umd',
    'ease-web-core-convert-external-account':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-convert-external-account/ease-web-core-convert-external-account.umd',
    'ease-web-core-debit-payment': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-debit-payment/ease-web-core-debit-payment.umd',
    'ease-web-core-document-center': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-document-center/ease-web-core-document-center.umd',
    'ease-web-core-eno-chat': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-eno-chat/ease-web-core-eno-chat.umd',
    'ease-web-core-eno-enrollment': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-eno-enrollment/ease-web-core-eno-enrollment.umd',
    'ease-web-core-eno-extension': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-eno-extension/ease-web-core-eno-extension.umd',
    'ease-web-core-global-footer': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-global-footer/ease-web-core-global-footer.umd',
    'ease-web-core-header': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-header/ease-web-core-header.umd',
    'ease-web-core-hero-bar': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-hero-bar/ease-web-core-hero-bar.umd',
    'ease-web-core-income': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-income/ease-web-core-income.umd',
    'ease-web-core-interstitials': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-interstitials/ease-web-core-interstitials.umd',
    'ease-web-core-know-your-customer':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-know-your-customer/ease-web-core-know-your-customer.umd',
    'ease-web-core-linked-app': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-linked-app/ease-web-core-linked-app.umd',
    'ease-web-core-profile': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-profile/ease-web-core-profile.umd',
    'ease-web-core-profile-phone': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-profile-phone/ease-web-core-profile-phone.umd',
    'ease-web-core-ra-email': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-ra-email/ease-web-core-ra-email.umd',
    'ease-web-core-rewards-widget': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-rewards-widget/ease-web-core-rewards-widget.umd',
    'ease-web-core-set-pin': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-set-pin/ease-web-core-set-pin.umd',
    'ease-web-core-settings': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-settings/ease-web-core-settings.umd',
    'ease-web-core-shared-state': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-shared-state/ease-web-core-shared-state.umd',
    'ease-web-core-sign-in': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-sign-in/ease-web-core-sign-in.umd',
    'ease-web-core-single-product-view':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-single-product-view/ease-web-core-single-product-view.umd',
    'ease-web-core-single-product-view':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-single-product-view/ease-web-core-single-product-view.umd',
    'ease-web-core-verify': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-verify/ease-web-core-verify.umd',
    'ease-web-core-verify-transfer-account':
      '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-verify-transfer-account/ease-web-core-verify-transfer-account.umd',
    'ease-web-core-widget-area': '../../../ease-web/ease-web-core-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-core-widget-area/ease-web-core-widget-area.umd',
    'ease-web-sbbank-business-profile':
      '../../../ease-web/ease-web-sbbank-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-sbbank-business-profile/ease-web-sbbank-business-profile.umd',
    'ease-web-sbbank-download-transactions':
      '../../../ease-web/ease-web-sbbank-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-sbbank-download-transactions/ease-web-sbbank-download-transactions.umd',
    'ease-web-sbbank-manage-auth-signers':
      '../../../ease-web/ease-web-sbbank-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-sbbank-manage-auth-signers/ease-web-sbbank-manage-auth-signers.umd',
    'ease-web-sbbank-order-checkbook':
      '../../../ease-web/ease-web-sbbank-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-sbbank-order-checkbook/ease-web-sbbank-order-checkbook.umd',
    'ease-web-sbbank-stop-check-payment':
      '../../../ease-web/ease-web-sbbank-de6855678d12464c68f7f5538eaa08ba6bdee821/ease-web-sbbank-stop-check-payment/ease-web-sbbank-stop-check-payment.umd'
  };

  _objectSpread(requireJSConfig.paths, entryPointPaths);

  return requireJSConfig;
});
