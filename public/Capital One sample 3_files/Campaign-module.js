define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Source;
    (function (Source) {
        Source["ASU"] = "ASU";
        Source["AccountLinking"] = "AccountLinking";
    })(Source = exports.Source || (exports.Source = {}));
    var ContactInfoABTestProvider = /** @class */ (function () {
        function ContactInfoABTestProvider(_angularJSRouteProvider) {
            var _this = this;
            this._angularJSRouteProvider = _angularJSRouteProvider;
            this.addState = function (parentState) {
                _this._angularJSRouteProvider.addAngularJSRouteForNGElement({
                    parentState: parentState,
                    stateName: 'contactInfo',
                    name: 'ContactInfoModal',
                    stateUrl: 'ContactInfo',
                    angularDependencies: ['ease-web-core-contact-info'],
                    featureToggles: [],
                    template: '<c1-element-core-features-contact-info-modal> </c1-element-core-features-contact-info-modal>'
                });
            };
            this.$get = function () { return _this; };
        }
        ContactInfoABTestProvider.$inject = ['AngularJSRouteProvider', 'EaseConstant'];
        return ContactInfoABTestProvider;
    }());
    exports.ContactInfoABTestProvider = ContactInfoABTestProvider;
    var CampaignModule = angular.module('CampaignModule', []);
    CampaignModule.config(config);
    CampaignModule.provider('ContactInfoRoute', ContactInfoABTestProvider);
    config.$inject = ['$stateProvider', 'easeCoreTemplatesProvider', 'easeCoreFilesProvider', 'i18nContent', 'LazyLoadedStatesProvider'];
    function config($stateProvider, easeCoreTemplatesProvider, easeCoreFilesProvider, i18nContent, LazyLoadedStatesProvider) {
        var campaignState = {
            name: 'ContactInfo',
            url: '/ContactInfo?source',
            params: {
                source: Source.ASU,
                onPageExit: null,
                onPageLoad: null
            },
            data: {
                hideFooter: true,
                hideBackButton: true,
                disableCapitalOneLogo: true
            },
            resolve: {
                source: [
                    '$stateParams',
                    '$state',
                    'EaseConstant',
                    function ($stateParams, $state, EaseConstant) {
                        var source = $stateParams.source;
                        if (!source) {
                            $state.go(EaseConstant.states.kAccountSummary);
                        }
                        return source;
                    }
                ],
                EVT_SYNCH_TOKEN: [
                    'EASEUtilsFactory',
                    function (EASEUtilsFactory) {
                        return EASEUtilsFactory.generateSyncId();
                    }
                ],
                stepsInitCheck: [
                    '$timeout',
                    '$state',
                    'EaseConstant',
                    'stepService',
                    'source',
                    function ($timeout, $state, EaseConstant, stepService, source) {
                        if (source === Source.ASU) {
                            if (!stepService.getIsInitialized()) {
                                $timeout(function () {
                                    $state.go(EaseConstant.states.kWelcome);
                                }, 0);
                                return Promise.reject();
                            }
                        }
                        return Promise.resolve();
                    }
                ],
                contactInfoCompletedCheck: [
                    '$timeout',
                    '$state',
                    'EaseConstant',
                    'stepService',
                    'source',
                    function ($timeout, $state, EaseConstant, stepService, source) {
                        if (source === Source.ASU && stepService.contactInfoCompleted) {
                            $timeout(function () {
                                $state.reload();
                            }, 0);
                        }
                        return;
                    }
                ],
                campaignDependencies: [
                    '$ocLazyLoad',
                    '$log',
                    'stepService',
                    function ($ocLazyLoad, $log, stepService) {
                        return $ocLazyLoad
                            .load({
                            name: 'campaignModule',
                            files: [easeCoreFilesProvider.get('controller', 'Campaign')]
                        })
                            .catch(function (error) {
                            $log.error('Failed to load campaignDependencies: ' + error);
                            stepService.exitContactInfo();
                        });
                    }
                ],
                featureToggleData: ['featureToggleFactory', function (featureToggleFactory) { return featureToggleFactory.initializeFeatureToggleData(); }],
                enableContactInfoAngularElement: [
                    'featureToggleData',
                    'EaseConstant',
                    function (featureToggleData, EaseConstant) {
                        return !!featureToggleData[EaseConstant.features.enableContactInfoAngularElementPage];
                    }
                ],
                // just while the FT service is moved over
                enableBusinessPhones: [
                    'featureToggleData',
                    'EaseConstant',
                    function (featureToggleData, EaseConstant) {
                        return featureToggleData[EaseConstant.features.enableShowBusinessPhone];
                    }
                ],
                contactInfoSteps: [
                    'stepService',
                    function (stepService) { return (stepService.steps && stepService.steps.contactInfo ? stepService.steps.contactInfo : []); }
                ],
                contactInfoStepsEnabled: [
                    'contactInfoSteps',
                    'EaseConstant',
                    'featureToggleData',
                    'stepService',
                    function (contactInfoSteps, EaseConstant, featureToggleData, stepService) {
                        return {
                            showEmail: contactInfoSteps.some(function (elem) { return elem.stepCode === EaseConstant.stepType.primeEmail; }),
                            showPhone: contactInfoSteps.some(function (elem) { return elem.stepCode === EaseConstant.stepType.phoneNumber; }),
                            showBusinessPhone: featureToggleData[EaseConstant.features.enableShowBusinessPhone] &&
                                contactInfoSteps.some(function (elem) { return elem.stepCode === EaseConstant.stepType.phoneNumber; }),
                            autoLink: contactInfoSteps.some(function (elem) { return elem.stepCode === EaseConstant.stepType.autoLink; })
                        };
                    }
                ],
                accountSummary: [
                    'enableContactInfoAngularElement',
                    'summaryService',
                    'source',
                    function (enableContactInfoAngularElement, summaryService, source) {
                        if (enableContactInfoAngularElement && source === Source.AccountLinking) {
                            return summaryService.set();
                        }
                    }
                ],
                emailDependencies: [
                    'enableContactInfoAngularElement',
                    'contactInfoStepsEnabled',
                    '$ocLazyLoad',
                    '$log',
                    function (enableContactInfoAngularElement, contactInfoStepsEnabled, $ocLazyLoad, $log) {
                        if (enableContactInfoAngularElement || !contactInfoStepsEnabled.showEmail) {
                            return;
                        }
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: [easeCoreFilesProvider.get('component', 'EmailManagement'), easeCoreFilesProvider.get('service', 'EmailManagement')]
                        })
                            .catch(function (err) {
                            $log.error('Error loading dependencies for email', err);
                            return { failed: true };
                        });
                    }
                ],
                emailSection: [
                    'enableContactInfoAngularElement',
                    'EaseConstant',
                    'contactInfoStepsEnabled',
                    '$injector',
                    'emailDependencies',
                    'EVT_SYNCH_TOKEN',
                    function (enableContactInfoAngularElement, EaseConstant, contactInfoStepsEnabled, $injector, emailDependencies, // Email dependencies needed to inject EmailManagementService
                    EVT_SYNCH_TOKEN) {
                        if (enableContactInfoAngularElement || !contactInfoStepsEnabled.showEmail || emailDependencies.failed) {
                            return { hide: true };
                        }
                        var headers = { BUS_EVT_ID: EaseConstant.busEvtId.email.get, EVT_SYNCH_TOKEN: EVT_SYNCH_TOKEN };
                        var EmailManagementService = $injector.get('EmailManagementService');
                        return (EmailManagementService.fetchPrimaryEmail(headers)
                            // hide the email section if it comes back as undefined/null
                            .then(function (primaryEmailObj) { return (primaryEmailObj ? { sectionData: primaryEmailObj } : { hide: true }); }, function () { return ({ hide: true }); }));
                    }
                ],
                phoneDependencies: [
                    'enableContactInfoAngularElement',
                    'featureToggleData',
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    'contactInfoStepsEnabled',
                    function (enableContactInfoAngularElement, featureToggleData, // Wait for FT before starting to load all dependencies for phone
                    $ocLazyLoad, $injector, $log, contactInfoStepsEnabled) {
                        if (enableContactInfoAngularElement || !contactInfoStepsEnabled.showPhone) {
                            return;
                        }
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
                            return { failed: true };
                        });
                    }
                ],
                phoneSection: [
                    'enableContactInfoAngularElement',
                    'stepService',
                    '_',
                    'phoneDependencies',
                    '$injector',
                    '$log',
                    'EaseConstant',
                    'contactInfoStepsEnabled',
                    'EVT_SYNCH_TOKEN',
                    function (enableContactInfoAngularElement, stepService, _, phoneDependencies, // PhoneDependencies needed in order to inject PhoneStore
                    $injector, $log, EaseConstant, contactInfoStepsEnabled, EVT_SYNCH_TOKEN) {
                        if (enableContactInfoAngularElement || !contactInfoStepsEnabled.showPhone || phoneDependencies.failed) {
                            return { hide: true };
                        }
                        var getPhoneHeaders = {
                            BUS_EVT_ID: EaseConstant.busEvtId.campaign.getPhones,
                            EVT_SYNCH_TOKEN: EVT_SYNCH_TOKEN
                        };
                        // Hydrate phone store
                        var PhoneStore = $injector.get('PhoneStore');
                        return PhoneStore.hydratePhoneStore(getPhoneHeaders)
                            .then(function (data) {
                            var errorIdString = _.get(data, 'error.data.easeDisplayError.errorIdString', '');
                            if (errorIdString === EaseConstant.errorIdStrings.SUSPECTED_FRAUD) {
                                return stepService.exitContactInfo();
                            }
                            return { hide: false };
                        })
                            .catch(function (error) {
                            $log.error('Error when getting phones', error);
                            return { hide: false };
                        });
                    }
                ],
                businessPhoneSection: [
                    'enableContactInfoAngularElement',
                    'contactInfoStepsEnabled',
                    'phoneDependencies',
                    '$injector',
                    'phoneSection',
                    function (enableContactInfoAngularElement, contactInfoStepsEnabled, phoneDependencies, // PhoneDependencies needed in order to inject PhoneStore
                    $injector, phoneSection // PhoneStore needs to be hydrated before checking if business accounts exist
                    ) {
                        if (enableContactInfoAngularElement || !contactInfoStepsEnabled.showPhone || !contactInfoStepsEnabled.showBusinessPhone) {
                            return { hide: true };
                        }
                        var PhoneStore = $injector.get('PhoneStore');
                        return {
                            hide: !PhoneStore.businessAccounts || !PhoneStore.businessAccounts.length
                        };
                    }
                ],
                ngElementDependencies: [
                    'enableContactInfoAngularElement',
                    'angularElementsUtils',
                    function (enableContactInfoAngularElement, angularElementsUtils) {
                        if (!enableContactInfoAngularElement) {
                            return;
                        }
                        return angularElementsUtils.getAngularElementsDependencies().then(function () {
                            return angularElementsUtils.getAngularElementsFeature(['ease-web-core-contact-info']);
                        });
                    }
                ],
                finalDataCheck: [
                    'enableContactInfoAngularElement',
                    'emailSection',
                    'phoneSection',
                    '$timeout',
                    'stepService',
                    'contactInfoStepsEnabled',
                    '$q',
                    'stepsInitCheck',
                    function (enableContactInfoAngularElement, emailSection, phoneSection, $timeout, stepService, contactInfoStepsEnabled, $q, stepsInitCheck) {
                        if (enableContactInfoAngularElement) {
                            return;
                        }
                        if (phoneSection.hide && emailSection.hide && !contactInfoStepsEnabled.autoLink) {
                            $timeout(function () { return stepService.exitContactInfo(); }, 0);
                            return $q.reject();
                        }
                        else {
                            return;
                        }
                    }
                ]
            },
            controller: 'CampaignController',
            controllerAs: 'campaignCtrl',
            title: i18nContent['ease.core.campaignacctsetup.title'],
            templateUrl: easeCoreTemplatesProvider.get('Campaign')
        };
        LazyLoadedStatesProvider.addPhoneStatesOnParent({
            parentState: campaignState,
            phoneStateData: {
                disableDeeplink: true,
                showBackButtonOnFirstScreenForWebview: true
            }
        });
        $stateProvider.state(campaignState);
        LazyLoadedStatesProvider.addEmailStatesOnParent(campaignState);
    }
});
