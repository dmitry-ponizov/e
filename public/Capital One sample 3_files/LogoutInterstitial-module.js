define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogoutInterstitialModule = angular.module('LogoutInterstitialModule', []).constant('logoutInterstitialConstant', {
        coreLogoutInterstitialStates: [
            'accountSummary',
            'escid',
            'accountDetails.transactions',
            'accountDetails.settings',
            'customerSettings.settings',
            'customerSettings.profile',
            'security',
            'alerts',
            'customerSettings.virtualCards',
            'SummAccPrefAddExtAccount'
        ],
        logoutPageContext: {
            Core: 'AccountSummary-Logout',
            Card: 'AccountDetails-Card-Logout',
            Bank: 'AccountDetails-Bank-Logout',
            AutoLoan: 'AccountDetails-AutoLoan-Logout'
        }
    });
});
