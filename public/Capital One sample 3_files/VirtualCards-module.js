/**
 * @fileoverview Virtual Cards : Module
 * src/features/CustomerSettings/VirtualCards/VirtualCards-module.ts
 */
define(['angular'], function (angular) {
    'use strict';
    var vcConfig = {
        childModule: 'VirtualCards',
        childRoute: 'virtualCards',
        editChildRoute: 'editVirtualCard',
        parentModule: 'CustomerSettings',
        parentRoute: 'customerSettings',
        vcUrl: '/VirtualCards',
        editVcUrl: '/editVirtualCard'
    };
    /**
     * @function
     * VirtualCards configuration function to be applied to stateProvider
     * @param {Object} $stateProvider
     * @param {Object} EaseConstant
     * @param {Object} easeCoreTemplatesProvider
     *    src/utils/utilities/easeCustomerUtils.js
     * @param {Object} easeCoreFilesProvider
     *    src/utils/utilities/easeCustomerUtils.js
     */
    virtualCardsConfig.$inject = [
        '$stateProvider',
        'EaseConstant',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider',
        'i18nContent',
        'ContentConstant',
        'angularDynamicRouteProvider'
    ];
    function virtualCardsConfig($stateProvider, EaseConstant, easeCoreTemplatesProvider, easeCoreFilesProvider, i18nContent, ContentConstant, angularDynamicRouteProvider) {
        var vcResolve = {
            ////////////////////////////////////////
            // feature toggle
            ////////////////////////////////////////
            featureToggleData: [
                'featureToggleFactory',
                function (featureToggleFactory) {
                    return featureToggleFactory.initializeFeatureToggleData();
                }
            ],
            ////////////////////////////////////////
            // virtual cards injected dependencies
            ////////////////////////////////////////
            virtualCardsDependencies: [
                '$ocLazyLoad',
                'EASEUtilsFactory',
                function ($ocLazyLoad, EASEUtilsFactory) {
                    // update L2 title
                    EASEUtilsFactory.setCustomerTitleData(i18nContent['ease.common.capitalonego']);
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            easeCoreFilesProvider.get('services', [vcConfig.parentModule, vcConfig.childModule]),
                            easeCoreFilesProvider.get('controller', [vcConfig.parentModule, vcConfig.childModule]),
                            easeCoreFilesProvider.get('directives', [vcConfig.parentModule, vcConfig.childModule]),
                            easeCoreFilesProvider.get('filters', [vcConfig.parentModule, vcConfig.childModule])
                        ]
                    });
                }
            ],
            ////////////////////////////////////////
            // account summary data
            ////////////////////////////////////////
            summaryDataFS: [
                'featureToggleData',
                'EASEUtilsFactory',
                'summaryService',
                '$q',
                function (featureToggleData, EASEUtilsFactory, summaryService, $q) {
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
            ////////////////////////////////////////
            // payment card data call
            ////////////////////////////////////////
            paymentCardData: [
                'virtualCardsDependencies',
                'vcRestService',
                '$state',
                '$rootScope',
                'featureToggleData',
                function (virtualCardsDependencies, vcRestService, $state, $rootScope, featureToggleData) {
                    var cardHelperFn = function (response) {
                        if (response.status === EaseConstant.kVirtualCards.http.ok &&
                            response.data &&
                            response.data.plain().hasEligibleCards &&
                            !response.data.plain().isAllCardsFraudLocked) {
                            return response.data.plain();
                        }
                        else if (response.status === EaseConstant.kVirtualCards.http.nocontent) {
                            vcRestService.returnToSettingsPage(ContentConstant.kSnagModalHeader, ContentConstant.kSnagFeatureOffShortLabel);
                        }
                        else {
                            if (response && response.data && typeof response.data.plain === 'function') {
                                var plainData = response.data.plain();
                                $rootScope.$broadcast('error', {
                                    msgHeader: plainData.easeDisplayError.headerMessage || 'Error',
                                    msgBody: plainData.easeDisplayError.displayMessage || 'Unable to complete request.'
                                });
                            }
                        }
                    };
                    if (featureToggleData[EaseConstant.features.virtualCards]) {
                        return vcRestService
                            .getPaymentCardDataRestangular()
                            .then(function (response) {
                            return cardHelperFn(response);
                        })
                            .catch(function (ex) {
                            vcRestService.returnToSettingsPage(ContentConstant.kSnagModalHeader, ContentConstant.kSnagFeatureOffShortLabel);
                        });
                    }
                    else {
                        vcRestService.returnToSettingsPage(ContentConstant.kSnagModalHeader, ContentConstant.kSnagFeatureOffShortLabel);
                    }
                }
            ],
            ////////////////////////////////////////
            // tap user preference data
            ////////////////////////////////////////
            tapUserPreferences: [
                'virtualCardsDependencies',
                'featureToggleData',
                '$state',
                'goTapService',
                'paymentCardData',
                'EaseConstant',
                '$rootScope',
                'vcRestService',
                function (virtualCardsDependencies, featureToggleData, $state, goTapService, paymentCardData, EaseConstant, $rootScope, vcRestService) {
                    if (featureToggleData[EaseConstant.features.virtualCards] && paymentCardData) {
                        return goTapService
                            .getVirtualCardsPreference()
                            .then(function (response) {
                            if (response.status === EaseConstant.kVirtualCards.http.ok && response.data) {
                                return response.data.plain();
                            }
                            else {
                                return vcRestService.returnToSettingsPage();
                            }
                        })
                            .catch(function (ex) {
                            vcRestService.returnToSettingsPage(ContentConstant.kSnagModalHeader, ContentConstant.kSnagFeatureOffShortLabel);
                        });
                    }
                    else {
                        vcRestService.returnToSettingsPage();
                    }
                }
            ],
            ////////////////////////////////////////
            // Number of virtual cards to show
            ////////////////////////////////////////
            transactionLimit: [
                '$window',
                function ($window) {
                    if ($window.innerWidth > 1000) {
                        return EaseConstant.kVirtualCards.VIRTUAL_CARDS_PAGE_LIMIT;
                    }
                    else {
                        return EaseConstant.kVirtualCards.VIRTUAL_CARDS_PAGE_LIMIT_MOBILE;
                    }
                }
            ],
            ////////////////////////////////////////
            // transform of payment data
            ////////////////////////////////////////
            transformPaymentCardData: [
                'virtualCardsDependencies',
                'vcRestService',
                'tapUserPreferences',
                'paymentCardData',
                '$filter',
                'transactionLimit',
                '$rootScope',
                '$state',
                function (virtualCardsDependencies, vcRestService, tapUserPreferences, paymentCardData, $filter, transactionLimit, $rootScope, $state) {
                    // order primary card from user preferences as first
                    var index = _.findIndex(paymentCardData, function (card) {
                        return card.cardReferenceId === tapUserPreferences.paymentCardReferenceId;
                    });
                    if (index > 0) {
                        var tmp = paymentCardData[0];
                        paymentCardData[0] = paymentCardData[index];
                        paymentCardData[index] = tmp;
                    }
                    var transformedCardData = {
                        unlockedCardsArray: [],
                        lockedCardArray: []
                    };
                    var entry;
                    if (paymentCardData.isAllCardsFraudLocked) {
                        $rootScope.$broadcast('error', {
                            msgHeader: 'Error',
                            msgBody: 'Unable to complete request.'
                        });
                        return $state.go('customerSettings.settings');
                    }
                    paymentCardData.paymentCards.forEach(function (item) {
                        entry = {};
                        if (item.isFraudLocked) {
                            return;
                        }
                        entry.sliceValue = transactionLimit;
                        entry.sliceText = i18nContent['ease.core.capitalonego.virtualcards.token.more.text'];
                        // DEFAULT NUMBER OF CARDS
                        entry.accountReferenceId = item.accountReferenceId;
                        entry.cardReferenceId = item.cardReferenceId;
                        entry.name = item.productDescription;
                        entry.lastFour = $filter('tailOfString')(item.cardNumber, 4, '?');
                        entry.nameAndLastFour = item.productDescription + '...' + $filter('tailOfString')(item.cardNumber, 4, '?');
                        entry.locked = item.isCardLocked;
                        entry.network = item.cardNetworkType.toLowerCase();
                        if (entry.locked) {
                            transformedCardData.lockedCardArray.push(entry);
                        }
                        else {
                            transformedCardData.unlockedCardsArray.push(entry);
                        }
                    });
                    return transformedCardData;
                }
            ]
        };
        // end resolve object
        var virtualCardsState = {
            name: vcConfig.parentRoute + '.' + vcConfig.childRoute,
            params: {
                L1: null
            },
            url: vcConfig.vcUrl,
            templateUrl: easeCoreTemplatesProvider.get('VirtualCards'),
            onEnter: [
                '$window',
                function ($window) {
                    $window.scroll(0, 0);
                }
            ],
            controller: 'VirtualCardsController',
            controllerAs: 'vcCtrl',
            title: i18nContent['ease.common.capitalonego']
        }; // end virtualCardsState configuration object
        var editVirtualCardState = {
            name: vcConfig.parentRoute + '.' + vcConfig.childRoute + '.' + vcConfig.editChildRoute,
            url: vcConfig.editVcUrl + '?tokenRef&cardRef&reveal',
            parent: virtualCardsState,
            resolve: {},
            controller: 'EditVirtualCardCtrl'
        }; // end virtualCardsState configuration object
        var dynamicVirtualCardsState = angularDynamicRouteProvider.createState({
            url: vcConfig.vcUrl,
            name: vcConfig.parentRoute + '.' + vcConfig.childRoute,
            params: {
                L1: null
            },
            title: i18nContent['ease.common.capitalonego'],
            data: {
                hideFooter: false
            },
            angularFeatureToggles: [EaseConstant.features.enableAngularVirtualCards],
            controllerAs: 'vcCtrl',
            resolve: vcResolve,
            angularState: {
                template: '<c1-element-consumer-virtual-numbers></c1-element-consumer-virtual-numbers>',
                pageViewObject: null,
                onEnter: [
                    '$window',
                    'EASEUtilsFactory',
                    function ($window, EASEUtilsFactory) {
                        EASEUtilsFactory.setCustomerTitleData(i18nContent['ease.common.capitalonego']);
                        $window.scroll(0, 0);
                    }
                ]
            },
            angularJsState: virtualCardsState,
            angularDependencies: ['ease-web-commerce-consumer-virtual-numbers']
        });
        ////////////////////////////////////////
        // ui.router - configure state
        ////////////////////////////////////////
        $stateProvider.state(dynamicVirtualCardsState);
        angularDynamicRouteProvider.state({
            url: vcConfig.editVcUrl + '?tokenRef&cardRef&reveal',
            name: vcConfig.parentRoute + '.' + vcConfig.childRoute + '.' + vcConfig.editChildRoute,
            angularFeatureToggles: [EaseConstant.features.enableAngularVirtualCards],
            title: i18nContent['ease.common.capitalonego'],
            controllerAs: 'EditVirtualCardCtrl',
            parent: dynamicVirtualCardsState,
            angularJsState: editVirtualCardState,
            angularDependencies: ['ease-web-commerce-consumer-virtual-numbers']
        });
    }
    return angular
        .module('VirtualCardsModule', ['EaseProperties', 'EaseLocalizeModule', 'easeAppUtils', 'coreUtils'])
        .config(virtualCardsConfig);
});
