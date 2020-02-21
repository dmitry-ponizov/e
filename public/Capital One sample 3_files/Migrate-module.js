define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MigrateModule = angular.module('MigrateModule', []);
    MigrateModule.config(config);
    config.$inject = [
        '$stateProvider',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider',
        'i18nContent',
        'EaseConstant',
        'LazyLoadedStatesProvider'
    ];
    function config($stateProvider, easeCoreTemplatesProvider, easeCoreFilesProvider, i18nContent, EaseConstant, LazyLoadedStatesProvider) {
        var migrateState = {
            name: EaseConstant.states.kVerify,
            url: '/verify',
            data: {
                disableCapitalOneLogo: true,
                hideFooter: true,
                hideBackButton: true
            },
            pageViewObject: {
                levels: ['migration']
            },
            resolve: {
                featureToggleData: [
                    'featureToggleFactory',
                    'EaseConstant',
                    'EASEUtilsFactory',
                    function (featureToggleFactory, EaseConstant, EASEUtilsFactory) {
                        return featureToggleFactory.initializeFeatureToggleData().then(function (data) {
                            if (data[EaseConstant.features.enableMigrateFeature] && data[EaseConstant.features.enableEditPhone]) {
                                return data;
                            }
                            EASEUtilsFactory.navigateOrCloseWebview(EaseConstant.states.kWelcome);
                        });
                    }
                ],
                enableVerifyAngularElementPage: [
                    'featureToggleData',
                    function (featureToggleData) {
                        var isMigrationElementEnabled = featureToggleData[EaseConstant.features.enableVerifyAngularElementPage];
                        // We don't want the pubsubs to trigger for both the old and new page
                        migrateState.pageViewObject = isMigrationElementEnabled ? null : migrateState.pageViewObject;
                        return isMigrationElementEnabled;
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
                            .catch(function (err) {
                            $log.error('Error loading dependencies for email', err);
                        });
                    }
                ],
                incomeEmploymentService: [
                    'featureToggleData',
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    function (featureToggleData, $ocLazyLoad, $injector, $log) {
                        return $ocLazyLoad
                            .load({
                            name: 'incomeComponent',
                            serie: true,
                            // the IncomeEmploymentModule is defined in the component file, we might want to move it in its own file so we can load only the service
                            files: [
                                easeCoreFilesProvider.get('component', 'IncomeEmployment'),
                                easeCoreFilesProvider.get('services', 'IncomeEmployment')
                            ]
                        }, function (error) { return $log.info('Failed to load Income employment service: ' + error); })
                            .then(function () { return $injector.get('incomeEmploymentService'); });
                    }
                ],
                cardAccountReferenceIds: [
                    'incomeEmploymentService',
                    function (incomeEmploymentService) {
                        return incomeEmploymentService.getCardAccounts().then(function (cardAccounts) {
                            return cardAccounts ? cardAccounts.map(function (cardAccount) { return cardAccount.referenceId; }) : [];
                        });
                    }
                ],
                // income and email added because migrate depends on them
                migrateFactory: [
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    'incomeEmploymentService',
                    'EmailManagementService',
                    function ($ocLazyLoad, $injector, $log, incomeEmploymentService, EmailManagementService) {
                        return $ocLazyLoad
                            .load({
                            name: 'migrateModule',
                            serie: true,
                            files: [
                                easeCoreFilesProvider.get('services', 'Migrate'),
                                easeCoreFilesProvider.get('controller', 'Migrate'),
                                easeCoreFilesProvider.get('directives', 'Migrate')
                            ]
                        }, function (error) {
                            $log.info('Failed to load migrateDependencies: ' + error);
                        })
                            .then(function () {
                            return $injector.get('migrateFactory');
                        });
                    }
                ],
                accountSummary: [
                    'featureToggleData',
                    'EaseConstant',
                    'summaryService',
                    function (featureToggleData, EaseConstant, summaryService) {
                        summaryService.addNoCacheHeader = true;
                        return summaryService.set();
                    }
                ],
                PhoneDependencies: [
                    'featureToggleData',
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    function (featureToggleData, // Wait for FT before starting to load all dependencies for phone
                    $ocLazyLoad, $injector, $log) {
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: [easeCoreFilesProvider.get('module', 'Phone'), easeCoreFilesProvider.get('dependency-service', 'Phone')]
                        })
                            .then(function () {
                            var phoneDependencyService = $injector.get('PhoneDependencyService');
                            // Start loading phone modal components
                            phoneDependencyService.loadPhoneModalFiles();
                            // Wait for loading of phone manager components
                            return phoneDependencyService.loadPhoneManager();
                        })
                            .catch(function (error) {
                            $log.error('Error loading PhoneDependencyService', error);
                            EASEUtilsFactory.navigateOrCloseWebview(EaseConstant.states.kWelcome);
                        });
                    }
                ],
                phoneData: [
                    'PhoneDependencies',
                    'PhoneStore',
                    '$log',
                    'EASEUtilsFactory',
                    'enableVerifyAngularElementPage',
                    function (PhoneDependencies, // PhoneDependencies needed in order to inject PhoneStore
                    PhoneStore, $log, EASEUtilsFactory, enableVerifyAngularElementPage) {
                        if (enableVerifyAngularElementPage) {
                            return;
                        }
                        var getPhoneHeaders = {
                            BUS_EVT_ID: EaseConstant.busEvtId.migration.getPhones,
                            EVT_SYNCH_TOKEN: EASEUtilsFactory.generateSyncId()
                        };
                        // Hydrate phone store
                        return PhoneStore.hydratePhoneStore(getPhoneHeaders)
                            .then(function (response) {
                            response.getKnownNumbersFailed && EASEUtilsFactory.navigateOrCloseWebview(EaseConstant.states.kWelcome);
                        })
                            .catch(function (error) {
                            $log.error('Error when getting phones', error);
                            EASEUtilsFactory.navigateOrCloseWebview(EaseConstant.states.kWelcome);
                        });
                    }
                ],
                // account summary needs to load first
                incomeSection: [
                    'migrateFactory',
                    'accountSummary',
                    'featureToggleData',
                    'enableVerifyAngularElementPage',
                    function (migrateFactory, accountSummary, featureToggleData, enableVerifyAngularElementPage) {
                        if (!enableVerifyAngularElementPage && featureToggleData[EaseConstant.features.enableIncomeCollection]) {
                            return migrateFactory.getIncomeSection();
                        }
                        return { hide: true };
                    }
                ],
                emailSection: [
                    'migrateFactory',
                    'featureToggleData',
                    'enableVerifyAngularElementPage',
                    function (migrateFactory, featureToggleData, enableVerifyAngularElementPage) {
                        if (!enableVerifyAngularElementPage &&
                            featureToggleData[EaseConstant.features.enableEmailOnMigrate] &&
                            featureToggleData[EaseConstant.features.enableEditEmail]) {
                            return migrateFactory.getEmailSection();
                        }
                        return { hide: true };
                    }
                ],
                ngElementDependencies: [
                    'angularElementsUtils',
                    'enableVerifyAngularElementPage',
                    function (angularElementsUtils, enableVerifyAngularElementPage) {
                        if (!enableVerifyAngularElementPage) {
                            return;
                        }
                        return angularElementsUtils.getAngularElementsDependencies().then(function () {
                            return angularElementsUtils.getAngularElementsFeature(['ease-web-core-verify']);
                        });
                    }
                ]
            },
            controller: 'MigrateController',
            controllerAs: 'migrateCtrl',
            title: i18nContent['ease.common.verify'],
            templateUrl: easeCoreTemplatesProvider.get('Migrate')
        };
        LazyLoadedStatesProvider.addEmailStatesOnParent(migrateState);
        LazyLoadedStatesProvider.addPhoneStatesOnParent({
            parentState: migrateState,
            phoneStateData: {
                disableDeeplink: true,
                showBackButtonOnFirstScreenForWebview: true
            }
        });
        $stateProvider.state(migrateState);
    }
});
