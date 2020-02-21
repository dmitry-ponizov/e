define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    angular.module('AccountLinkingModule', []).config(config);
    config.$inject = ['AngularJSRouteProvider', 'i18nContent', 'easeCoreTemplatesProvider', 'EaseConstant'];
    function config(AngularJSRouteProvider, i18nContent, easeCoreTemplatesProvider, EaseConstant) {
        var accountLinkingState = {
            stateName: EaseConstant.states.kLinkAccount,
            stateUrl: 'linkAccounts',
            angularDependencies: ['ease-web-core-account-linking'],
            title: i18nContent['ease.common.linkaccount'],
            featureToggles: ['ease.core.accountLinking', 'ease.core.contactinfo.angular'],
            template: "<c1-element-core-features-account-linking></c1-element-core-features-account-linking>",
            data: {
                disableCapitalOneLogo: true,
                hideFooter: true,
                hideBackButton: true
            },
            params: {
                interstitialMessage: {}
            }
        };
        AngularJSRouteProvider.addAngularJSRouteForNGElement(accountLinkingState);
    }
});
