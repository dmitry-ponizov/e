'use strict';
define(['angular', 'coreloader'], function (angular, coreloader) {
    coreChangeAddressStateProvider.$inject = ['$stateProvider'];
    function coreChangeAddressStateProvider($stateProvider) {
        this.registerState = function registerStateFn(stateName, url, dependencies, service) {
            var state = {
                name: stateName,
                url: url || '',
                resolve: {
                    showModalAddress: [
                        'featureToggleData',
                        'EaseConstant',
                        'profileInfoFactory',
                        '$q',
                        '$timeout',
                        '$state',
                        'personalInfoDependencies',
                        function showMAfn(data, constant, profileInfoFactory, $q, $timeout, $state) {
                            var deferred = $q.defer();
                            if (!data[constant.features.enableShowAddress] || !data[constant.features.enableEditCardAddress]) {
                                profileInfoFactory.openFeatureUnavailable();
                                $timeout(function timeoutFn() {
                                    $state.go('accountSummary');
                                }, 1000);
                            }
                            else {
                                deferred.resolve(true);
                            }
                            return deferred.promise;
                        }
                    ],
                    loadDependencies: [
                        '$ocLazyLoad',
                        '$log',
                        function ldRFn($ocLazyLoad, $log) {
                            return $ocLazyLoad
                                .load({
                                serie: true,
                                files: dependencies
                            })
                                .then(function ldOcFn() {
                                $log.info('dependencies successfully loaded....');
                            });
                        }
                    ],
                    loadModal: [
                        '$log',
                        'loadDependencies',
                        service,
                        'easeHttpInterceptor',
                        'showModalAddress',
                        function ($log, ld, CC, easeHttpInterceptor) {
                            // Here we are silence the default error and firing the CC error handler
                            easeHttpInterceptor.setBroadCastEventOnce('errHandler');
                            try {
                                CC.loadChangeAddress();
                            }
                            catch (error) {
                                $log.info(error);
                                easeHttpInterceptor.resetBroadCastEvent();
                            }
                        }
                    ]
                },
                onExit: [
                    'easeHttpInterceptor',
                    function onExitFn(easeHttpInterceptor) {
                        // here we are reseting the default error to null
                        easeHttpInterceptor.resetBroadCastEvent();
                    }
                ]
            };
            $stateProvider.state(state);
        };
        this.$get = function getFn() {
            return {};
        };
    }
    personalInfoConfig.$inject = [
        '$stateProvider',
        'EaseConstant',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider',
        'CoreChangeAddressStateProvider',
        'i18nContent',
        'LazyLoadedStatesProvider',
        'AngularJSRouteProvider'
    ];
    function personalInfoConfig($stateProvider, EaseConstant, easeCoreTemplatesProvider, easeCoreFilesProvider, changeAddressStateProvider, i18nContent, LazyLoadedStatesProvider, AngularJSRouteProvider) {
        var urlCheckingFn = function (opts) {
            // tslint:disable-next-line:one-variable-per-declaration
            var $rootScope, $location, $q, ContentConstant, i18nContent, test, $state;
            ($rootScope = opts.$rootScope, $location = opts.$location, $q = opts.$q, ContentConstant = opts.ContentConstant, i18nContent = opts.i18nContent, test = opts.test, $state = opts.$state);
            var error = {};
            var deferred = $q.defer();
            if (!test()) {
                error.msgHeader = i18nContent[ContentConstant.kSnagModalHeader];
                error.msgBody = i18nContent[ContentConstant.kSnagFeatureOffLabel];
                $rootScope.$broadcast('error', error);
                $location.path('/Profile');
                deferred.reject(false);
            }
            else if (test().displayMessage) {
                var stateObject = {
                    addEmailErrMsg: test().displayMessage
                };
                $state.go('customerSettings.profile', stateObject);
            }
            else {
                deferred.resolve(true);
            }
            return deferred.promise;
        };
        var personalInformationState = {
            name: 'customerSettings.profile',
            url: '/Profile',
            pageViewObject: { levels: [EaseConstant.pubsub.customersettingState, EaseConstant.pubsub.profileState] },
            resolve: {
                featureToggleData: [
                    'featureToggleFactory',
                    function (featureToggleFactory) {
                        return featureToggleFactory.initializeFeatureToggleData();
                    }
                ],
                personalInfoDependencies: [
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    function ($ocLazyLoad, $injector, $log) {
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: [
                                easeCoreFilesProvider.get('services', ['CustomerSettings', 'PersonalInformation']),
                                easeCoreFilesProvider.get('controller', ['CustomerSettings', 'PersonalInformation']),
                                easeCoreFilesProvider.get('directives', ['CustomerSettings', 'PersonalInformation'])
                            ]
                        })
                            .then(function () {
                            return {
                                profileInfoFactory: $injector.get('profileInfoFactory')
                            };
                        }, function (error) {
                            $log.info('Failed to load personalInfoDependencies: ' + error);
                        });
                    }
                ],
                PhoneDependencyService: [
                    '$ocLazyLoad',
                    '$injector',
                    '$log',
                    function ($ocLazyLoad, $injector, $log) {
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
                profilePhoneDependencies: [
                    '$ocLazyLoad',
                    'EaseConstant',
                    '$log',
                    function ($ocLazyLoad, EaseConstant, $log) {
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: easeCoreFilesProvider.getFiles(EaseConstant.kFilePathLists.profilePhoneComponent)
                        })
                            .then(function () { return true; }, function (error) {
                            $log.error('Error loading Profile Phone Dependencies', error);
                            return { failed: true };
                        });
                    }
                ],
                setFactoryData: [
                    'personalInfoDependencies',
                    function (personalInfoDependencies) {
                        return personalInfoDependencies.profileInfoFactory;
                    }
                ],
                emailData: [
                    'setFactoryData',
                    'featureToggleData',
                    function (setFactoryData, featureToggleData) {
                        if (featureToggleData[EaseConstant.features.enableShowEmail] &&
                            !featureToggleData[EaseConstant.features.enableShowEmailNGElement]) {
                            return setFactoryData.getPersonalEmailList();
                        }
                        else {
                            return [];
                        }
                    }
                ],
                accountsData: [
                    'EASEUtilsFactory',
                    'summaryService',
                    '$q',
                    'setFactoryData',
                    function (EASEUtilsFactory, summaryService, $q, setFactoryData) {
                        var allAccounts = EASEUtilsFactory.getSummaryData().accounts;
                        if (allAccounts) {
                            setFactoryData.setSmallBusinessAccounts(allAccounts);
                            return true;
                        }
                        else {
                            var deferred_1 = $q.defer();
                            summaryService.set().then(function () {
                                allAccounts = EASEUtilsFactory.getSummaryData().accounts;
                                setFactoryData.setSmallBusinessAccounts(allAccounts);
                                deferred_1.resolve(true);
                            });
                            return deferred_1.promise;
                        }
                    }
                ],
                phoneNumberData: [
                    'featureToggleData',
                    'setFactoryData',
                    'accountsData',
                    function (featureToggleData, setFactoryData, accountsData) {
                        if (accountsData &&
                            featureToggleData[EaseConstant.features.enableShowPhone] &&
                            !featureToggleData[EaseConstant.features.enableShowPhoneAngular]) {
                            return setFactoryData.getProfilePhoneNumberList(EaseConstant.busEvtId.getPhone);
                        }
                        else {
                            return [];
                        }
                    }
                ],
                smallBusinessPhoneData: [
                    'featureToggleData',
                    'setFactoryData',
                    'accountsData',
                    function (featureToggleData, setFactoryData, accountsData) {
                        var smallBusinessAccountsData = setFactoryData.getSmallBusinessAccounts();
                        if (accountsData &&
                            featureToggleData[EaseConstant.features.enableShowSmallBusinessPhone] &&
                            !featureToggleData[EaseConstant.features.enableShowPhoneAngular] &&
                            smallBusinessAccountsData &&
                            smallBusinessAccountsData.length > 0) {
                            return setFactoryData.getSmallBusinessPhoneNumberList(EaseConstant.busEvtId.getPhone);
                        }
                        else {
                            return [];
                        }
                    }
                ],
                emailNGElement: [
                    'featureToggleData',
                    'angularElementsUtils',
                    '$log',
                    function (featureToggleData, angularElementsUtils, $log) {
                        if (featureToggleData[EaseConstant.features.enableShowEmail] &&
                            featureToggleData[EaseConstant.features.enableShowEmailNGElement]) {
                            return angularElementsUtils
                                .getAngularElementsDependencies()
                                .then(function () {
                                return angularElementsUtils.getAngularElementsFeature(['ease-web-core-ra-email']).then(function (response) {
                                    return !!response;
                                });
                            })
                                .catch(function (error) {
                                $log.error('Could not get Angular Dependencies for Email NG Element', error);
                                return false;
                            });
                        }
                        return false;
                    }
                ],
                phoneNGElement: [
                    'featureToggleData',
                    'angularElementsUtils',
                    '$log',
                    function (featureToggleData, angularElementsUtils, $log) {
                        if (featureToggleData[EaseConstant.features.enableShowPhone] &&
                            featureToggleData[EaseConstant.features.enableShowPhoneAngular]) {
                            return angularElementsUtils
                                .getAngularElementsDependencies()
                                .then(function () {
                                return angularElementsUtils.getAngularElementsFeature(['ease-web-core-profile-phone']).then(function (response) {
                                    return !!response;
                                });
                            })
                                .catch(function (error) {
                                $log.error('Could not get Angular Dependencies for Profile Phone NG Element', error);
                                return false;
                            });
                        }
                        return false;
                    }
                ],
                greetingNameNGElement: [
                    'featureToggleData',
                    'angularElementsUtils',
                    '$log',
                    function (featureToggleData, angularElementsUtils, $log) {
                        if (featureToggleData[EaseConstant.features.enableShowGreetingName] &&
                            featureToggleData[EaseConstant.features.enableShowGreetingNameAngular]) {
                            return angularElementsUtils
                                .getAngularElementsDependencies()
                                .then(function () {
                                return angularElementsUtils.getAngularElementsFeature(['ease-web-core-profile']).then(function (response) {
                                    return !!response;
                                });
                            })
                                .catch(function (error) {
                                $log.error('Could not get Angular Dependencies for Profile Greeting Name NG Element', error);
                                return false;
                            });
                        }
                        return false;
                    }
                ]
            },
            onEnter: function (EASEUtilsFactory, i18nContent) {
                EASEUtilsFactory.setCustomerTitleData(i18nContent['ease.common.profile']);
            },
            title: i18nContent['ease.common.profile'],
            controller: 'PersonalInformationController',
            controllerAs: 'PersonalInfoCtrl',
            params: { addEmailErrMsg: '' },
            templateUrl: easeCoreTemplatesProvider.get('PersonalInformation')
        };
        AngularJSRouteProvider.addAngularJSRouteForNGElement({
            parentState: personalInformationState,
            title: 'Email',
            stateName: 'email',
            stateUrl: 'email?action&level&emailRefId&emailLabel',
            controller: 'EmailDialogController',
            featureToggles: [EaseConstant.features.enableShowEmail, EaseConstant.features.enableShowEmailNGElement],
            angularJSDependencies: [],
            angularDependencies: ['ease-web-core-ra-email'],
            templateUrl: '/ease-ui/dist/features/CustomerSettings/PersonalInformation/html/PersonalInformation-emailModal.html',
            redirectStateName: ''
        });
        var addEmailState = {
            name: 'customerSettings.profile.addEmail',
            url: '/AddEmail',
            parent: personalInformationState,
            pageViewObject: { levels: [EaseConstant.pubsub.emailModal.addEmail] },
            resolve: {
                featureToggleData: [
                    'featureToggleFactory',
                    function (featureToggleFactory) {
                        return featureToggleFactory.initializeFeatureToggleData();
                    }
                ],
                emailListData: [
                    'personalInfoDependencies',
                    'featureToggleData',
                    function (personalInfoDependencies, featureToggleData) {
                        if (featureToggleData[EaseConstant.features.enableShowEmail]) {
                            return personalInfoDependencies.profileInfoFactory.getPersonalEmailList();
                        }
                        else {
                            return [];
                        }
                    }
                ],
                urlChecking: [
                    'featureToggleData',
                    '$rootScope',
                    '$location',
                    '$q',
                    'ContentConstant',
                    'i18nContent',
                    'emailListData',
                    '$state',
                    function (featureToggleData, $rootScope, $location, $q, ContentConstant, i18nContent, emailListData, $state) {
                        var test = function () {
                            if (featureToggleData[EaseConstant.features.enableShowEmail] &&
                                featureToggleData[EaseConstant.features.enableAddEmail] &&
                                Array.isArray(emailListData) &&
                                emailListData.length < EaseConstant.maxEmailCountUPP) {
                                return true;
                            }
                            else {
                                return emailListData;
                            }
                        };
                        var opts = { $rootScope: $rootScope, $location: $location, $q: $q, ContentConstant: ContentConstant, i18nContent: i18nContent, test: test, $state: $state };
                        return urlCheckingFn.apply(null, [opts]);
                    }
                ]
            },
            controller: 'AddEmailModalController',
            title: i18nContent['ease.common.add'] + " " + i18nContent['ease.common.email']
        };
        var editEmailState = {
            name: 'customerSettings.profile.editEmail',
            pageViewObject: { levels: [EaseConstant.pubsub.emailModal.editEmail] },
            parent: personalInformationState,
            title: i18nContent['ease.common.edit'] + " " + i18nContent['ease.common.email'],
            resolve: {
                urlChecking: [
                    '$location',
                    function ($location) {
                        $location.path('/Profile');
                    }
                ]
            }
        };
        var deleteEmailState = {
            name: 'customerSettings.profile.deleteEmail',
            pageViewObject: { levels: [EaseConstant.pubsub.emailModal.editEmail, EaseConstant.pubsub.emailModal.deleteEmail] },
            parent: editEmailState,
            resolve: {
                urlChecking: [
                    '$location',
                    function ($location) {
                        $location.path('/Profile');
                    }
                ]
            }
        };
        var editGreetingNameState = {
            name: 'customerSettings.profile.editGreetingName',
            url: '/EditGreetingName',
            parent: personalInformationState,
            pageViewObject: { levels: ['edit greeting name'] },
            title: i18nContent['ease.core.profileprefs.editgreetingtitle.label'],
            controller: 'EditGreetingNameController',
            resolve: {
                urlChecking: [
                    'featureToggleData',
                    '$rootScope',
                    '$location',
                    '$q',
                    'ContentConstant',
                    'i18nContent',
                    function (featureToggleData, $rootScope, $location, $q, ContentConstant, i18nContent) {
                        var test = function () {
                            return (featureToggleData[EaseConstant.features.enableShowGreetingName] &&
                                featureToggleData[EaseConstant.features.enableEditGreetingName]);
                        };
                        var opts = {
                            $rootScope: $rootScope,
                            $location: $location,
                            $q: $q,
                            ContentConstant: ContentConstant,
                            i18nContent: i18nContent,
                            test: test
                        };
                        return urlCheckingFn.apply(null, [opts]);
                    }
                ]
            }
        };
        $stateProvider
            .state(personalInformationState)
            .state(addEmailState)
            .state(editEmailState)
            .state(deleteEmailState)
            .state(editGreetingNameState);
        var dependencies = ['js!StatementModule', 'js!CreditCard'];
        changeAddressStateProvider.registerState('customerSettings.profile.changeAddress', '/ChangeAddress', dependencies, 'CC');
        LazyLoadedStatesProvider.addManageBankAutoAddressStatesOnParent({ parentState: personalInformationState, dependencies: ['js!Bank'] });
        var phoneUrls = ['HomePhone', 'WorkPhone', 'MobilePhone', 'EditHomeTCPA', 'EditWorkTCPA', 'EditMobileTCPA'];
        var phoneScreens = { tcpa: 'Tcpa', editPhone: 'EditPhone' };
        for (var _i = 0, phoneUrls_1 = phoneUrls; _i < phoneUrls_1.length; _i++) {
            var url = phoneUrls_1[_i];
            LazyLoadedStatesProvider.addProfilePagePhoneState({
                parentState: personalInformationState,
                phoneStateData: {
                    disableDeeplink: false,
                    showBackButtonOnFirstScreenForWebview: false
                },
                phoneType: url,
                initPhoneScreen: url.toLowerCase().indexOf(phoneScreens.tcpa.toLowerCase()) !== -1 ? phoneScreens.tcpa : phoneScreens.editPhone
            });
        }
    }
    return angular
        .module('personalInformationModule', [
        'EaseProperties',
        'easeAppUtils',
        'coreUtils',
        'restangular',
        'PhysicalAddressLink',
        'ui.router',
        'oc.lazyLoad',
        'EaseExceptionsModule',
        'EaseModalModule'
    ])
        .config(personalInfoConfig)
        .provider('CoreChangeAddressState', coreChangeAddressStateProvider);
});
