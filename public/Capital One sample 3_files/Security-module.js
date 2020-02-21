'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(['angular', 'moment'], function (angular, moment) {
    var SecurityModule = angular.module('SecurityModule', ['ngMessages', 'EaseLocalizeModule']);
    SecurityModule.config(config);
    config.$inject = ['$stateProvider', 'easeTemplatesProvider', 'easeFilesProvider', 'i18nContent', 'EaseConstant'];
    function config($stateProvider, easeTemplatesProvider, easeFilesProvider, i18nContent, EaseConstant) {
        var securityState = {
            name: 'security',
            url: '/security',
            pageViewObject: { levels: [EaseConstant.pubsub.customersettingState, EaseConstant.states.kSecurity], otherProps: {} },
            resolve: {
                accountSummaryData: function (summaryService) {
                    if (!summaryService.getLobArray().length) {
                        return summaryService.set();
                    }
                    return summaryService.get();
                },
                linkedAppNGElement: function (featureToggleData, angularElementsUtils) {
                    var assignPubSubValue = function (response) {
                        var linkedAppPubSubValues = {
                            angular: 'elements',
                            legacy: 'legacy'
                        };
                        securityState.pageViewObject.otherProps = {
                            linkedAppsTile: response ? linkedAppPubSubValues.angular : linkedAppPubSubValues.legacy
                        };
                    };
                    if (featureToggleData[EaseConstant.features.enableShowLinkedApps] &&
                        featureToggleData[EaseConstant.features.enableShowLinkedAppsNGElement]) {
                        return angularElementsUtils
                            .getAngularElementsDependencies()
                            .then(function () {
                            return angularElementsUtils.getAngularElementsFeature(['ease-web-core-linked-app']).then(function (response) {
                                assignPubSubValue(response);
                                return !!response;
                            });
                        })
                            .catch(function () {
                            assignPubSubValue(false);
                            return false;
                        });
                    }
                    assignPubSubValue(false);
                    return false;
                },
                signInAngular: function (featureToggleData, angularElementsUtils) {
                    if (featureToggleData[EaseConstant.features.enableSignInAngular] &&
                        (featureToggleData[EaseConstant.features.enableChangePassword] || featureToggleData[EaseConstant.features.enableChangeUsername])) {
                        return angularElementsUtils
                            .getAngularElementsDependencies()
                            .then(function () { return !!angularElementsUtils.getAngularElementsFeature(['ease-web-core-sign-in']); })
                            .catch(function () { return false; });
                    }
                    return false;
                },
                dependencies: function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            easeFilesProvider.get('services', 'Security'),
                            easeFilesProvider.get('controller', 'Security'),
                            easeFilesProvider.get('directive', 'Security')
                        ]
                    });
                },
                featureToggleData: function (featureToggleFactory) {
                    return featureToggleFactory.initializeFeatureToggleData();
                },
                username: [
                    'dependencies',
                    'SecurityFactory',
                    'featureToggleData',
                    'EaseConstant',
                    function (dependencies, SecurityFactory, featureToggleData, EaseConstant) {
                        if (featureToggleData[EaseConstant.features.enableChangeUsername]) {
                            return SecurityFactory.fetchUsername().then(function (data) { return data.username; });
                        }
                    }
                ],
                linkedApps: [
                    'SecurityFactory',
                    'dependencies',
                    'featureToggleData',
                    'EaseConstant',
                    '$log',
                    function (SecurityFactory, dependencies, featureToggleData, EaseConstant, $log) {
                        if (featureToggleData[EaseConstant.features.enableShowLinkedApps] &&
                            !featureToggleData[EaseConstant.features.enableShowLinkedAppsNGElement]) {
                            return SecurityFactory.getLinkedApps().then(function (data) { return data; }, function (error) {
                                $log.error('Linked Apps Error: ', error);
                                return [];
                            });
                        }
                        else {
                            return [];
                        }
                    }
                ],
                deviceList: [
                    'dependencies',
                    'SecurityFactory',
                    'EaseConstant',
                    '$log',
                    'featureToggleData',
                    function (dependencies, SecurityFactory, EaseConstant, $log, featureToggleData) {
                        if (featureToggleData[EaseConstant.features.enableDeviceHistoryFeature]) {
                            return SecurityFactory.getDeviceHistory().then(function (data) {
                                if (!data || !data.authenticatedDevices) {
                                    return [];
                                }
                                return data.authenticatedDevices.map(function (device) {
                                    var locations = device.geoLocations.sort(function (a, b) { return moment(b.lastAccessTimestamp) - moment(a.lastAccessTimestamp); });
                                    return __assign({}, device, { geoLocations: locations });
                                });
                            }, function (ex) {
                                $log.log(ex);
                                return [];
                            });
                        }
                    }
                ]
            },
            controller: 'SecurityController',
            controllerAs: 'securityCtrl',
            title: i18nContent['ease.common.security'],
            templateUrl: easeTemplatesProvider.get('Security')
        };
        var changePassword = {
            name: 'security.changePassword',
            url: '/changePassword',
            parent: securityState,
            pageViewObject: { levels: [EaseConstant.pubsub.securityModal.securityChangePassword] },
            onEnter: [
                'easeUIModalService',
                'featureToggleData',
                '$state',
                'easeTemplates',
                'signInAngular',
                'easeExceptionsService',
                'encryptionFactory',
                function (easeUIModalService, featureToggleData, $state, easeTemplates, signInAngular, easeExceptionsService, encryptionFactory) {
                    if (!signInAngular) {
                        var enableEditPasswordToggle = featureToggleData[EaseConstant.features.enableEditPassword];
                        if (enableEditPasswordToggle) {
                            encryptionFactory.getEncryptionKeyFromServer().then(function () {
                                easeUIModalService
                                    .showModal({
                                    templateUrl: easeTemplates.get('Security', '', 'changePassword'),
                                    controller: 'ChangePasswordModalController'
                                })
                                    .then(function (modal) {
                                    modal.close.then(function (_a) {
                                        var _b = (_a === void 0 ? {} : _a).modalCloseSuccess, modalCloseSuccess = _b === void 0 ? false : _b;
                                        if (modalCloseSuccess) {
                                            $state.go('security.passwordSuccess');
                                        }
                                        else {
                                            $state.go('security');
                                        }
                                    });
                                });
                            }, function () {
                                $state.go('security');
                                easeExceptionsService.displayErrorHandler();
                            });
                        }
                        else {
                            easeExceptionsService.displayErrorHandler(EaseConstant.defaultErrorMessage.msgHeader, i18nContent['core.common.snag.featureoff.short.label']);
                            $state.go('security');
                        }
                    }
                }
            ],
            template: "<c1-ease-element-core-features-security-update-password-dialog-wrapper\n                   ng-custom-element\n                   ngce-prop-username=\"securityCtrl.username\"\n                   ngce-on-navigate_to_parent_state=\"navigateToParentState()\">\n                 </c1-ease-element-core-features-security-update-password-dialog-wrapper>",
            controller: 'UpdatePasswordAngularController'
        };
        var changeUsername = {
            name: 'security.changeUsername',
            url: '/changeUsername',
            parent: securityState,
            pageViewObject: { levels: [EaseConstant.pubsub.securityModal.securityChangeUsername] },
            onEnter: [
                'easeUIModalService',
                'featureToggleData',
                '$state',
                'easeTemplates',
                'signInAngular',
                'SecurityFactory',
                'easeExceptionsService',
                function (easeUIModalService, featureToggleData, $state, easeTemplates, signInAngular, SecurityFactory, easeExceptionsService) {
                    if (!signInAngular) {
                        var enableChangeUsernameToggle = featureToggleData[EaseConstant.features.enableChangeUsername];
                        if (enableChangeUsernameToggle) {
                            easeUIModalService
                                .showModal({
                                templateUrl: easeTemplates.get('Security', '', 'changeUsername'),
                                controller: 'ChangeUsernameModalController',
                                inputs: {
                                    username: SecurityFactory.getUserName()
                                }
                            })
                                .then(function (modal) {
                                modal.close.then(function (_a) {
                                    var _b = (_a === void 0 ? {} : _a).modalCloseSuccess, modalCloseSuccess = _b === void 0 ? false : _b;
                                    if (modalCloseSuccess) {
                                        $state.go('security.usernameSuccess');
                                    }
                                    else {
                                        $state.go('security');
                                    }
                                });
                            });
                        }
                        else {
                            easeExceptionsService.displayErrorHandler(EaseConstant.defaultErrorMessage.msgHeader, i18nContent['core.common.snag.featureoff.short.label']);
                            $state.go('security');
                        }
                    }
                }
            ],
            template: "<c1-ease-element-core-features-security-update-username-dialog-wrapper\n                   ng-custom-element\n                   ngce-prop-username=\"securityCtrl.username\"\n                   ngce-on-navigate_to_parent_state=\"navigateToParentState()\">\n                 </c1-ease-element-core-features-security-update-username-dialog-wrapper>",
            controller: 'UpdateUsernameAngularController'
        };
        var unlinkApp = {
            name: 'security.unlinkApp',
            parent: securityState,
            pageViewObject: { levels: [EaseConstant.pubsub.securityModal.securityUnlinkApp] },
            params: {
                linkedApps: {}
            },
            onEnter: function (easeUIModalService, $state, easeTemplates, $stateParams) {
                easeUIModalService
                    .showModal({
                    templateUrl: easeTemplates.get('Security', '', 'unlinkModal'),
                    controller: 'UnlinkAppModalController',
                    inputs: {
                        linkedApps: $stateParams.linkedApps
                    }
                })
                    .then(function (modal) {
                    modal.close.then(function () {
                        $state.go('security');
                    });
                });
            }
        };
        var passwordSuccess = {
            name: 'security.passwordSuccess',
            pageViewObject: {
                levels: [EaseConstant.pubsub.securityModal.securityChangePassword, EaseConstant.pubsub.securityModal.securityStatus]
            },
            onEnter: function (easeUIModalService, $state, easeTemplates) {
                easeUIModalService
                    .showModal({
                    templateUrl: easeTemplates.get('Security', '', 'success'),
                    controller: 'ChangePasswordModalController'
                })
                    .then(function (modal) {
                    modal.close.then(function () {
                        $state.go('security');
                    });
                });
            }
        };
        var usernameSuccess = {
            name: 'security.usernameSuccess',
            pageViewObject: {
                levels: [EaseConstant.pubsub.securityModal.securityChangeUsername, EaseConstant.pubsub.securityModal.securityStatus]
            },
            onEnter: function (easeUIModalService, $state, easeTemplates, username) {
                easeUIModalService
                    .showModal({
                    templateUrl: easeTemplates.get('Security', '', 'success'),
                    controller: 'ChangeUsernameModalController',
                    inputs: {
                        username: username
                    }
                })
                    .then(function (modal) {
                    modal.close.then(function () {
                        $state.go('security');
                    });
                });
            }
        };
        $stateProvider
            .state(securityState)
            .state(changePassword)
            .state(changeUsername)
            .state(unlinkApp)
            .state(passwordSuccess)
            .state(usernameSuccess);
    }
});
