'use strict';
define(['angular'], function (angular) {
    var ProfileHubModule = angular.module('ProfileHubModule', ['easeAppUtils']);
    ProfileHubModule.config(profileHubConfig);
    ProfileHubModule.controller('profileHubController', profileHubController);
    profileHubConfig.$inject = ['$stateProvider', 'easeCoreTemplatesProvider', 'easeFilesProvider'];
    function profileHubConfig($stateProvider, easeCoreTemplatesProvider, easeFilesProvider) {
        var profileHubState = {
            name: 'profileHub',
            url: '/profileHub',
            controller: 'profileHubController',
            controllerAs: 'profileHubCtrl',
            templateUrl: easeCoreTemplatesProvider.get('ProfileHub'),
            resolve: {
                accountSummaryData: [
                    'summaryService',
                    function (summaryService) {
                        if (summaryService.inSessionAlready) {
                            summaryService.inSessionAlready = false;
                            return summaryService.get().then(function (data) {
                                return data;
                            });
                        }
                        else {
                            return summaryService.set().then(function (data) {
                                return data;
                            });
                        }
                    }
                ]
            }
        };
        $stateProvider.state(profileHubState);
    }
    profileHubController.$inject = [
        '$rootScope',
        '$state',
        '$timeout',
        'EaseConstant',
        'i18nContent',
        'pubsubService',
        'featureToggleFactory',
        'LogoutInterstitialService',
        'summaryService',
        'coreloader',
        'EASEUtilsFactory',
        'globalNavigationUtils'
    ];
    function profileHubController($rootScope, $state, $timeout, EaseConstant, i18nContent, pubsubService, featureToggleFactory, LogoutInterstitialService, summaryService, coreloader, EASEUtilsFactory, globalNavigationUtils) {
        var vm = this;
        vm.globalNavigationUtils = globalNavigationUtils;
        initCtrl(vm, pubsubService, EASEUtilsFactory, summaryService, coreloader, featureToggleFactory);
        angular.extend(vm, {
            headerOptions: EaseConstant.easeHeaderOptions,
            easeCapLogoLink: EaseConstant.states,
            enableDisplayAlerts: false,
            i18nContent: i18nContent,
            navigateTo: function (location) {
                if (vm.pending) {
                    return;
                }
                $state.go(location);
            },
            reload: function () {
                pubsubService.pubsubTrackAnalytics({ name: 'capitalone:button' });
                if ($state.current.name === EaseConstant.states.kAccountSummary) {
                    $state.reload();
                }
            }
        });
        $rootScope.$on('logout', function () {
            vm.isFeedBackButton = vm.isBackButton = vm.isProfile = false;
        });
        function initCtrl(vm, pubsubService, EASEUtilsFactory, summaryService, coreloader, featureToggleFactory) {
            vm.pending = vm.disableClick = false;
            showAlerts(vm, featureToggleFactory, EASEUtilsFactory, summaryService);
            pubsubService.pubsubTrackAnalytics({
                taxonomy: {
                    level1: 'ease',
                    level2: 'profile hub',
                    level3: '',
                    level4: '',
                    level5: '',
                    country: 'us',
                    language: 'english',
                    system: coreloader.getSiteCatalystSystem()
                },
                lob: summaryService.getLobArray().join(' | ')
            });
        }
        function showAlerts(vm, featureToggleFactory, EASEUtilsFactory, summaryService) {
            var featureToggle = featureToggleFactory.initializeFeatureToggleData();
            featureToggle.then(function (response) {
                if (response) {
                    vm.enableDisplayAlerts = EASEUtilsFactory.isShowAlerts(response, summaryService.getLobArray());
                }
                else {
                    vm.enableDisplayAlerts = false;
                }
            });
        }
    }
    return ProfileHubModule;
});
