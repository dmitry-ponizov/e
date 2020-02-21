define(['angular'], function (angular) {
    'use strict';
    settingsConfig.$inject = [
        '$stateProvider',
        'EaseConstant',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider',
        'addAccountStateProvider',
        'externalAccountStateProvider',
        'verifyAccountStateProvider',
        'EnoExtensionStateProvider',
        'i18nContent',
        'AngularJSRouteProvider'
    ];
    function settingsConfig($stateProvider, EaseConstant, easeCoreTemplatesProvider, easeCoreFilesProvider, addAccountStateProvider, externalAccountStateProvider, verifyAccountStateProvider, EnoExtensionStateProvider, i18nContent, AngularJSRouteProvider) {
        var settingsState = {
            name: EaseConstant.states.kAccountPreferences,
            url: '/Settings',
            onEnter: function (EASEUtilsFactory) {
                EASEUtilsFactory.setCustomerTitleData(i18nContent['ease.common.settings']);
            },
            pageViewObject: { levels: ['customer profile preferences', 'settings'] },
            resolve: {
                settingsDependencies: [
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    function ($ocLazyLoad, $injector, $log) {
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: [
                                easeCoreFilesProvider.get('services', ['CustomerSettings', 'Settings']),
                                easeCoreFilesProvider.get('controller', ['CustomerSettings', 'Settings']),
                                easeCoreFilesProvider.get('directives', ['CustomerSettings', 'Settings'])
                            ]
                        })
                            .then(function () {
                            return {
                                settingsFactory: $injector.get('settingsFactory')
                            };
                        }, function (error) {
                            $log.info('Failed to load settingsDependencies: ' + error);
                        });
                    }
                ],
                accountReorderDependencies: function (angularElementsUtils) {
                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                        return angularElementsUtils.getAngularElementsFeature(['ease-web-core-account-reorder']);
                    });
                },
                NgAccountNicknameDependencies: [
                    'featureToggleData',
                    'angularElementsUtils',
                    function (featureToggleData, angularElementsUtils) {
                        var accountNicknameFeatureToggle = featureToggleData['ease.core.accountnickname.angular'];
                        if (!accountNicknameFeatureToggle) {
                            return false;
                        }
                        return angularElementsUtils.getAngularElementsDependencies().then(function () {
                            return angularElementsUtils.getAngularElementsFeature(['ease-web-core-account-nickname']);
                        });
                    }
                ],
                convertExternalAccountNGElement: [
                    'featureToggleData',
                    'angularElementsUtils',
                    function (featureToggleData, angularElementsUtils) {
                        var convertExternalAccountFeatureToggle = featureToggleData['ease.core.convertExternalAccount.angular'];
                        if (!convertExternalAccountFeatureToggle) {
                            return false;
                        }
                        return angularElementsUtils
                            .getAngularElementsDependencies()
                            .then(function () {
                            return angularElementsUtils.getAngularElementsFeature(['ease-web-core-convert-external-account']).then(function (response) {
                                return !!response;
                            });
                        })
                            .catch(function () { return false; });
                    }
                ],
                ummDependencies: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [easeCoreFilesProvider.get('services', 'UMMPayment')]
                        });
                    }
                ],
                summaryDataFS: [
                    'EASEUtilsFactory',
                    'summaryService',
                    '$q',
                    function (EASEUtilsFactory, summaryService, $q) {
                        if (EASEUtilsFactory.getSummaryData().accounts) {
                            return EASEUtilsFactory.getSummaryData();
                        }
                        else {
                            var deferred_1 = $q.defer();
                            summaryService.set().then(function () {
                                deferred_1.resolve(EASEUtilsFactory.getSummaryData());
                            });
                            return deferred_1.promise;
                        }
                    }
                ],
                featureToggleData: [
                    'featureToggleFactory',
                    function (featureToggleFactory) {
                        return featureToggleFactory.initializeFeatureToggleData();
                    }
                ],
                moneyMovementFeatureToggleData: [
                    'featureToggleFactory',
                    function (featureToggleFactory) {
                        var featureToggleData = featureToggleFactory.getFeatureToggleData();
                        if (featureToggleData.hasOwnProperty(EaseConstant.features.addExternalAccountFeature) ||
                            (featureToggleData.hasOwnProperty(EaseConstant.features.combinedmoneymovementAccounts) &&
                                featureToggleData.hasOwnProperty(EaseConstant.features.retrieveMoneyMovementAccounts))) {
                            return featureToggleData;
                        }
                        return featureToggleFactory.initializeFeatureToggleData();
                    }
                ],
                retrievePaymentAccounts: [
                    'EASEUtilsFactory',
                    '$q',
                    'moneyMovementFeatureToggleData',
                    function (EASEUtilsFactory, $q, featureToggleData) {
                        var moneyMovementAccountsResponse;
                        if (featureToggleData[EaseConstant.features.combinedmoneymovementAccounts] &&
                            featureToggleData[EaseConstant.features.retrieveMoneyMovementAccounts]) {
                            return EASEUtilsFactory.getMoneyMovementAccounts(EaseConstant.busEvtId.moneyMovementAccount, null, true)
                                .then(function (moneyMovementAccountsResponse) {
                                return moneyMovementAccountsResponse;
                            })
                                .catch(function (error) {
                                if (error && error.data) {
                                    moneyMovementAccountsResponse = error.data;
                                    return moneyMovementAccountsResponse;
                                }
                                return error;
                            });
                        }
                    }
                ],
                isEligibleForPrimaryPayment: [
                    'entitlementsSummaryService',
                    'featureToggleData',
                    'EASEUtilsFactory',
                    function (entitlementsSummaryService, featureToggleData, EASEUtilsFactory) {
                        if (featureToggleData[EaseConstant.features.combinedmoneymovementAccounts] &&
                            featureToggleData[EaseConstant.features.retrieveMoneyMovementAccounts]) {
                            var headers = {
                                BUS_EVT_ID: EaseConstant.busEvtId.settings.getEntitlementsSummary,
                                EVT_SYNCH_TOKEN: EASEUtilsFactory.generateSyncId()
                            };
                            return entitlementsSummaryService
                                .getEntitlementsSummaryData(headers)
                                .then(function () {
                                return entitlementsSummaryService.getPrimaryPaymentAccountEligibility();
                            })
                                .catch(function () { return false; });
                        }
                        return false;
                    }
                ],
                hasEligiblePaymentCard: [
                    'settingsDependencies',
                    'featureToggleData',
                    'goTapService',
                    'settingsFactory',
                    'summaryDataFS',
                    function (settingsDependencies, featureToggleData, goTapService, settingsFactory, summaryDataFS) {
                        var hasCreditCard = settingsFactory.hasCreditCardAccount(summaryDataFS);
                        if (featureToggleData[EaseConstant.features.virtualCards] && hasCreditCard) {
                            return goTapService
                                .getPaymentCardDataPreference()
                                .then(function (response) {
                                return (response.status === EaseConstant.kVirtualCards.http.ok &&
                                    response.data &&
                                    response.data.plain().hasEligibleCards &&
                                    !response.data.plain().isAllCardsFraudLocked);
                            })
                                .catch(function () {
                                return false;
                            });
                        }
                        else {
                            return false;
                        }
                    }
                ],
                isTAPUser: [
                    'settingsDependencies',
                    'featureToggleData',
                    'goTapService',
                    'hasEligiblePaymentCard',
                    function (settingsDependencies, featureToggleData, goTapService, hasEligiblePaymentCard) {
                        if (featureToggleData[EaseConstant.features.virtualCards] && hasEligiblePaymentCard) {
                            return goTapService
                                .getVirtualCardsPreference()
                                .then(function (response) {
                                return response.status === EaseConstant.kVirtualCards.http.ok;
                            })
                                .catch(function (ex) {
                                return null;
                            });
                        }
                        else {
                            return false;
                        }
                    }
                ],
                accountLanguageData: [
                    'settingsDependencies',
                    'featureToggleData',
                    'summaryService',
                    'EASEUtilsFactory',
                    'summaryDataFS',
                    function (settingsDependencies, featureToggleData, summaryService, EASEUtilsFactory, summaryDataFS) {
                        if (featureToggleData[EaseConstant.features.enableShowLanguageCommunication]) {
                            var lobs = summaryService.getLobArray();
                            if (EASEUtilsFactory.isShowAccountLanguage(lobs)) {
                                return settingsDependencies.settingsFactory.getAccountLanguage();
                            }
                        }
                    }
                ],
                settingsNGEntrypoint: [
                    'featureToggleData',
                    'angularElementsUtils',
                    '$q',
                    function (featureToggleData, angularElementsUtils, $q) {
                        if (featureToggleData[EaseConstant.features.settingsPageAngular]) {
                            return angularElementsUtils
                                .getAngularElementsDependencies()
                                .then(function () {
                                return angularElementsUtils.getAngularElementsFeature(['ease-web-core-settings']).then(function (response) {
                                    return !!response;
                                });
                            })
                                .catch(function () {
                                return false;
                            });
                        }
                        return $q.when(false);
                    }
                ]
            },
            title: i18nContent['ease.common.settings'],
            controller: 'SettingsController',
            controllerAs: 'settingsCtrl',
            params: { focusflag: false, moneyMovActRefId: '', isPrimaryAct: '' },
            templateUrl: easeCoreTemplatesProvider.get('Settings')
        };
        var convertExtAccount = {
            name: EaseConstant.states.kConvertExtAccount,
            parent: settingsState,
            url: '/:acctRefId/convert',
            onEnter: function ($stateParams, settingsFactory, otpService, $log, EASEUtilsFactory) {
                var pathParamObj = {
                    retrieveInternalAccount: EaseConstant.customerSettings.settings.retrieveExternalAccount
                };
                var externalAccountPromise = EASEUtilsFactory.getMoneyMovementAccounts(EaseConstant.busEvtId.moneyMovementAccount, pathParamObj);
                var handleOtp = function (data) {
                    var entries = data.entries;
                    var obj = _.find(entries, function (entry) {
                        return entry.moneyMovementAccountReferenceId === $stateParams.acctRefId;
                    });
                    otpService
                        .goToOtpForFeature(otpService.OtpFeature.CONVERT_EXT_ACCT, EASEUtilsFactory.doubleEncodeSlashes(encodeURIComponent(obj.moneyMovementAccountReferenceId)))
                        .then(function () {
                        var request = {
                            abaNumber: obj.abaNumber,
                            accountNumber: obj.displayAccountNumber
                        };
                        settingsFactory.convert(request);
                    }, function (error) {
                        $log.info('goToOtpForFeature failed: ' + error);
                    });
                };
                externalAccountPromise.then(handleOtp);
            }
        };
        var languagePrefState = {
            name: EaseConstant.states.kLanguagePrefState,
            url: '/Language',
            parent: settingsState,
            pageViewObject: { levels: ['change language'] },
            template: '<c1-ease-core-element-features-settings-language-online-viewing></c1-ease-core-element-features-settings-language-online-viewing>',
            resolve: {
                featureToggleData: [
                    'featureToggleFactory',
                    function (featureToggleFactory) {
                        return featureToggleFactory.initializeFeatureToggleData();
                    }
                ],
                urlChecking: [
                    'featureToggleData',
                    '$rootScope',
                    '$location',
                    '$q',
                    'ContentConstant',
                    function (featureToggleData, $rootScope, $location, $q, ContentConstant) {
                        var isOn = featureToggleData[EaseConstant.features.enableShowLanguage] && featureToggleData[EaseConstant.features.enableEditLanguage];
                        var error = {};
                        var deferred = $q.defer();
                        if (!isOn) {
                            error.msgHeader = i18nContent[ContentConstant.kSnagModalHeader];
                            error.msgBody = i18nContent[ContentConstant.kSnagFeatureOffLabel];
                            $rootScope.$broadcast('error', error);
                            $location.path('/Settings');
                            deferred.reject(false);
                        }
                        else {
                            deferred.resolve(true);
                        }
                        return deferred.promise;
                    }
                ]
            },
            onEnter: [
                'featureToggleData',
                'settingsFactory',
                'settingsNGEntrypoint',
                function onEnterFn(featureToggleData, settingsFactory, settingsNGEntrypoint) {
                    var ngElementEnabled = featureToggleData[EaseConstant.features.settings.enableShowLanguageAngularTile] && settingsNGEntrypoint;
                    if (!ngElementEnabled) {
                        settingsFactory.openEditLanguageModal();
                    }
                }
            ],
            title: 'Language'
        };
        var languageCommunicationsPrefState = {
            name: 'customerSettings.settings.languageAccount',
            url: '/LanguageAccount',
            parent: settingsState,
            pageViewObject: { levels: ['change account language'] },
            template: '<c1-element-core-features-settings-edit-account-language></c1-element-core-features-settings-edit-account-language>',
            resolve: {
                urlChecking: [
                    'featureToggleData',
                    '$rootScope',
                    'EaseConstant',
                    '$location',
                    '$q',
                    'ContentConstant',
                    'summaryService',
                    'EASEUtilsFactory',
                    'i18nContent',
                    function (featureToggleData, $rootScope, EaseConstant, $location, $q, ContentConstant, summaryService, EASEUtilsFactory, i18nContent) {
                        var lobs = summaryService.getLobArray();
                        var isCardAccount = EASEUtilsFactory.isShowAccountLanguage(lobs);
                        var isOn = featureToggleData[EaseConstant.features.enableEditAccountLanguage] && isCardAccount;
                        var error = {};
                        var deferred = $q.defer();
                        if (!isOn) {
                            error.msgHeader = i18nContent[ContentConstant.kSnagModalHeader];
                            error.msgBody = i18nContent[ContentConstant.kSnagFeatureOffLabel];
                            $rootScope.$broadcast('error', error);
                            $location.path('/Settings');
                            deferred.reject(false);
                        }
                        else {
                            deferred.resolve(true);
                        }
                        return deferred.promise;
                    }
                ],
                editAccountLanguageNGEntrypoint: [
                    'featureToggleData',
                    'angularElementsUtils',
                    '$q',
                    function (featureToggleData, angularElementsUtils, $q) {
                        if (featureToggleData[EaseConstant.features.settingsPageAngular] &&
                            featureToggleData[EaseConstant.features.settings.enableShowLanguageAngularTile]) {
                            return angularElementsUtils
                                .getAngularElementsDependencies()
                                .then(function () {
                                return angularElementsUtils.getAngularElementsFeature(['ease-web-core-settings']).then(function (response) {
                                    return !!response;
                                });
                            })
                                .catch(function () {
                                return false;
                            });
                        }
                        return $q.when(false);
                    }
                ]
            },
            controller: 'languageAccountController',
            title: 'LanguageAccounts'
        };
        var accountNicknameState = {
            name: 'customerSettings.settings.accountNickname',
            pageViewObject: { levels: ['edit account nickname'] },
            parent: settingsState,
            resolve: {
                featureToggleData: [
                    'featureToggleFactory',
                    function (featureToggleFactory) {
                        return featureToggleFactory.initializeFeatureToggleData();
                    }
                ]
            }
        };
        var reorderAccountsState = {
            name: 'customerSettings.settings.reorderAccounts',
            pageViewObject: { levels: ['reorder accounts'] },
            parent: settingsState,
            resolve: {
                accountReorderDependencies: function (angularElementsUtils) {
                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                        return angularElementsUtils.getAngularElementsFeature(['ease-web-core-account-reorder']);
                    });
                }
            }
        };
        EnoExtensionStateProvider.set(settingsState, EaseConstant.states.kEnoExtension);
        var enoExtensionState = EnoExtensionStateProvider.get();
        $stateProvider
            .state(settingsState)
            .state(languagePrefState)
            .state(convertExtAccount)
            .state(languageCommunicationsPrefState)
            .state(accountNicknameState)
            .state(reorderAccountsState)
            .state(enoExtensionState);
        addAccountStateProvider.set('AddExtAccount', settingsState, { levels: ['add external account', 'account information'] });
        externalAccountStateProvider.set(EaseConstant.stateNames.addExtAccountChooser, settingsState, 'AddExtAccountChooserCtrl as addExtAccChooserCtrl', 'addExternalAccChooser', '/AddAccountType', { levels: ['add external account', 'account chooser'] });
        externalAccountStateProvider.set('EditExtAccount', settingsState, 'editExternalAccountCtrl', 'editExternalAcc', '');
        externalAccountStateProvider.set('AddExtAccSuccessState', settingsState, 'SuccessExtUMMPaymentCtrl as SuccessaddExtPayAcct', 'addExternalAccSuccess', '');
        verifyAccountStateProvider.setVerifyStates({
            name: settingsState.name,
            siteCatalyst: ['settings']
        });
        AngularJSRouteProvider.addAngularJSRouteForNGElement({
            title: 'Virtual Numbers',
            pageViewObject: null,
            // parent: settingsState,
            stateName: 'VirtualNumbers',
            stateUrl: 'VirtualNumbers/:accountReferenceId',
            //featureToggles: [EaseConstant.features.enableShowEmail, EaseConstant.features.enableShowEmailNGElement],
            angularJSDependencies: [],
            angularDependencies: ['ease-web-commerce-virtual-numbers'],
            template: '<c1-element-virtual-numbers></c1-element-virtual-numbers>',
            redirectStateName: '',
            data: {
                hideFooter: false
            }
        });
    }
    return angular
        .module('settingsModule', [
        'EaseProperties',
        'EaseLocalizeModule',
        'easeAppUtils',
        'coreUtils',
        'TransferExternalAccountModule',
        'OtpModule',
        'EnoExtensionModule'
    ])
        .config(settingsConfig);
});
