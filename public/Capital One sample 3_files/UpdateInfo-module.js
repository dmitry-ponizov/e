define(['angular'], function (angular) {
    'use strict';
    var UpdateInfoModule = angular.module('UpdateInfoModule', []);
    UpdateInfoModule.config(config);
    config.$inject = [
        '$stateProvider',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider',
        'i18nContent',
        'EaseConstant',
        'LazyLoadedStatesProvider',
        'angularDynamicRouteProvider'
    ];
    function config($stateProvider, easeCoreTemplatesProvider, easeCoreFilesProvider, i18nContent, EaseConstant, LazyLoadedStatesProvider, angularDynamicRouteProvider) {
        var AngularJsResolvers = {
            incomeEmploymentService: [
                '$ocLazyLoad',
                '$log',
                '$injector',
                function ($ocLazyLoad, $log, $injector) {
                    $log.info('Anniversary Page - Attempting to load the Anniversary Page dependencies and launch the experience.');
                    return $ocLazyLoad
                        .load({
                        name: 'incomeComponent',
                        serie: true,
                        files: [
                            easeCoreFilesProvider.get('component', 'IncomeEmployment'),
                            easeCoreFilesProvider.get('services', 'IncomeEmployment')
                        ]
                    }, function (error) {
                        $log.info('Failed to load Income employment component files: ' + error);
                    })
                        .then(function () {
                        return $injector.get('incomeEmploymentService');
                    });
                }
            ],
            featureToggleData: ['featureToggleFactory', function (featureToggleFactory) { return featureToggleFactory.initializeFeatureToggleData(); }],
            updateInfoService: [
                '$ocLazyLoad',
                '$injector',
                '$log',
                'incomeEmploymentService',
                'EmailManagementService',
                'PhoneDependencies',
                function ($ocLazyLoad, $injector, $log, incomeEmploymentService, EmailManagementService, PhoneDependencies) {
                    return $ocLazyLoad
                        .load({
                        name: 'updateInfoModule',
                        serie: true,
                        files: [
                            easeCoreFilesProvider.get('services', 'UpdateInfo'),
                            easeCoreFilesProvider.get('controller', 'UpdateInfo'),
                            easeCoreFilesProvider.get('section-component', 'UpdateInfo'),
                            easeCoreFilesProvider.get('constants', 'UpdateInfo'),
                            easeCoreFilesProvider.get('snag-controller', 'UpdateInfo')
                        ]
                    }, function (error) {
                        $log.info('Failed to load UpdateInfo files: ' + error);
                    })
                        .then(function () { return $injector.get('updateInfoService'); });
                }
            ],
            evtSynchTokenHeaders: [
                'EASEUtilsFactory',
                function (EASEUtilsFactory) {
                    return {
                        EVT_SYNCH_TOKEN: EASEUtilsFactory.generateSyncId()
                    };
                }
            ],
            incomeEmploymentSection: [
                '$q',
                'updateInfoService',
                'evtSynchTokenHeaders',
                function ($q, updateInfoService, evtSynchTokenHeaders) {
                    return updateInfoService.getIncomeAndEmploymentStatus(evtSynchTokenHeaders);
                }
            ],
            emailSection: [
                'updateInfoService',
                'evtSynchTokenHeaders',
                function (updateInfoService, evtSynchTokenHeaders) {
                    return updateInfoService.getPrimaryEmail(evtSynchTokenHeaders);
                }
            ],
            phonesSection: [
                'updateInfoService',
                'evtSynchTokenHeaders',
                function (updateInfoService, evtSynchTokenHeaders) {
                    return updateInfoService.getPhones(evtSynchTokenHeaders);
                }
            ],
            harmonyPayload: [
                'updateInfoService',
                'evtSynchTokenHeaders',
                function (updateInfoService, evtSynchTokenHeaders) {
                    return updateInfoService.getHarmonyPayload(evtSynchTokenHeaders);
                }
            ],
            updateInfoPageFeatureToggle: [
                'featureToggleData',
                'EaseConstant',
                'EASEUtilsFactory',
                function (featureToggleData, EaseConstant, EASEUtilsFactory) {
                    var isUpdateInfoPageActive = featureToggleData[EaseConstant.features.enableUpdateInfoPage];
                    if (!isUpdateInfoPageActive) {
                        return EASEUtilsFactory.navigateOrCloseWebview(EaseConstant.states.kAccountSummary);
                    }
                }
            ],
            PhoneDependencyService: [
                'updateInfoPageFeatureToggle',
                '$ocLazyLoad',
                '$injector',
                '$log',
                function (updateInfoPageFeatureToggle, $ocLazyLoad, $injector, $log) {
                    return $ocLazyLoad
                        .load({
                        serie: true,
                        files: [easeCoreFilesProvider.get('module', 'Phone'), easeCoreFilesProvider.get('dependency-service', 'Phone')]
                    })
                        .then(function () {
                        var phoneDependencyService = $injector.get('PhoneDependencyService');
                        phoneDependencyService.loadPhoneModalFiles();
                        return phoneDependencyService;
                    })
                        .catch(function (err) { return $log.error('Error loading Phone dependency provider', err); });
                }
            ],
            PhoneDependencies: [
                'PhoneDependencyService',
                '$ocLazyLoad',
                '$injector',
                '$log',
                function (PhoneDependencyService, $ocLazyLoad, $injector, $log) {
                    if (!PhoneDependencyService) {
                        return;
                    }
                    return $ocLazyLoad
                        .load({
                        files: [
                            easeCoreFilesProvider.get('filter', 'Phone'),
                            easeCoreFilesProvider.get('constants', 'Phone'),
                            easeCoreFilesProvider.get('Store', 'Phone'),
                            easeCoreFilesProvider.get('api-service', 'Phone'),
                            easeCoreFilesProvider.get('modal-service', 'Phone')
                        ]
                    })
                        .then(function () {
                        return { phoneModal: $injector.get('PhoneModalService'), phoneApi: $injector.get('PhoneApiService') };
                    })
                        .catch(function (err) { return $log.error('Error loading Phone Service', err); });
                }
            ],
            EmailManagementService: [
                'featureToggleData',
                '$ocLazyLoad',
                '$injector',
                '$log',
                function (featureToggleData, $ocLazyLoad, $injector, $log) {
                    return $ocLazyLoad
                        .load({
                        serie: true,
                        files: [easeCoreFilesProvider.get('component', 'EmailManagement'), easeCoreFilesProvider.get('service', 'EmailManagement')]
                    })
                        .then(function () {
                        return $injector.get('EmailManagementService');
                    })
                        .catch(function (err) { return $log.error('Error loading dependencies for email', err); });
                }
            ],
            shouldNavigateOrCloseWebview: [
                'phonesSection',
                'emailSection',
                'incomeEmploymentSection',
                'harmonyPayload',
                'PhoneDependencies',
                'EASEUtilsFactory',
                '$log',
                'pubsubService',
                function (phonesSection, emailSection, incomeEmploymentSection, harmonyPayload, PhoneDependencies, EASEUtilsFactory, $log, pubsubService) {
                    var hasBannerGetFailed = harmonyPayload.hasGetFailed;
                    var redirectToL1 = function () { return EASEUtilsFactory.navigateOrCloseWebview(EaseConstant.states.kAccountSummary); };
                    if (hasBannerGetFailed) {
                        pubsubService.pageView({ levels: ['anniversary page', 'banner call', 'failure'] });
                        $log.error('Anniversary Page -  Received the anniversary data without banner. User was navigated to L1.');
                        redirectToL1();
                    }
                    else {
                        var hasSectionsGetFailed = [phonesSection, incomeEmploymentSection, emailSection].some(function (section) { return section.hasGetFailed; });
                        if (hasSectionsGetFailed || !PhoneDependencies) {
                            pubsubService.pageView({ levels: ['anniversary page', 'sections call', 'failure'] });
                            $log.error("Anniversary Page -  Unable to load data for anniversary page sections. User was navigated to L1.");
                            redirectToL1();
                        }
                    }
                }
            ]
        };
        var updateInfoState = angularDynamicRouteProvider.createState({
            name: EaseConstant.states.kUpdateInfo,
            url: '/updateInfo',
            title: i18nContent['ease.core.updateInfo.title'],
            controllerAs: 'updateInfoCtrl',
            data: {
                disableCapitalOneLogo: true,
                hideFooter: true,
                hideBackButton: true
            },
            params: {
                isInterPage: false,
                interstitialMessageStyle: ''
            },
            angularFeatureToggles: ['ease.core.updateInfoPage.angular', 'ease.core.updateInfoPage'],
            angularDependencies: ['ease-web-core-anniversary', 'ease-web-core-income'],
            angularJsState: {
                controller: 'UpdateInfoController',
                templateUrl: easeCoreTemplatesProvider.get('UpdateInfo'),
                resolve: AngularJsResolvers
            },
            angularState: {
                template: "<c1-ease-core-features-anniversary></c1-ease-core-features-anniversary><div ui-view></div>"
            }
        });
        var updateInfoIncomeEmploymentState = angularDynamicRouteProvider.createState({
            name: EaseConstant.states.kUpdateInfoIncome,
            url: '/income',
            title: i18nContent['ease.core.updateInfo.title'],
            parent: updateInfoState,
            data: {
                disableDeeplink: true
            },
            angularFeatureToggles: ['ease.core.updateInfoPage.angular'],
            angularJsState: {
                resolve: {
                    featureToggleData: ['featureToggleFactory', function (featureToggleFactory) { return featureToggleFactory.initializeFeatureToggleData(); }],
                    incomeEmploymentData: [
                        'updateInfoService',
                        function (updateInfoService) {
                            var incomeEmploymentSection = updateInfoService.getIncome();
                            return incomeEmploymentSection.sectionData;
                        }
                    ]
                },
                onEnter: [
                    'updateInfoService',
                    '$state',
                    'pubsubService',
                    function (updateInfoService, $state, pubsubService) {
                        pubsubService.pageView({ levels: ['updateinfo', '', 'edit income'] });
                        var onSubmit = function (incomeConfig) {
                            updateInfoService.setIncome({ sectionData: incomeConfig });
                            $state.go('^');
                        };
                        var incomeEmploymentSection = updateInfoService.getIncome();
                        updateInfoService.openIncomeEmploymentModal(onSubmit, angular.copy(incomeEmploymentSection.sectionData, {}));
                    }
                ]
            },
            angularState: {
                template: "<c1-element-core-features-income-employment-dialog-entry ng-custom-element></c1-element-core-features-income-employment-dialog-entry>"
            }
        });
        LazyLoadedStatesProvider.addEmailStatesOnParent(updateInfoState);
        LazyLoadedStatesProvider.addPhoneStatesOnParent({
            parentState: updateInfoState,
            phoneStateData: {
                disableDeeplink: true,
                showBackButtonOnFirstScreenForWebview: true
            }
        });
        $stateProvider.state(updateInfoState).state(updateInfoIncomeEmploymentState);
    }
});
