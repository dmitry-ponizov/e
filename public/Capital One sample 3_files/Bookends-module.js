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
define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    bookendState.$inject = ['easeCoreFilesProvider', 'StepsConfigProvider', 'i18nContent', 'angularDynamicRouteProvider'];
    function bookendState(easeCoreFilesProvider, StepsConfigProvider, i18nContent, angularDynamicRouteProvider) {
        var _this = this;
        var front;
        var back;
        this.baseResolveBlock = {
            bookendElementFeatureToggle: [
                'featureToggleFactory',
                function (featureToggleFactory) {
                    return !!featureToggleFactory.getFeatureToggleData()['ease.core.campaign.bookend.element'];
                }
            ],
            stepsGuard: [
                'stepService',
                function (stepService) {
                    /* Send the user to AccountSummary if the user is not in the Account Set Up flow */
                    return stepService.stepsRouteGuard();
                }
            ],
            bookendService: [
                '$ocLazyLoad',
                '$log',
                '$injector',
                'stepsGuard',
                function ($ocLazyLoad, $log, $injector, stepsGuard) {
                    return $ocLazyLoad
                        .load({
                        name: 'bookendModule',
                        files: [
                            easeCoreFilesProvider.get('services', 'Bookends'),
                            easeCoreFilesProvider.get('controller-front', 'Bookends'),
                            easeCoreFilesProvider.get('controller-back', 'Bookends'),
                            easeCoreFilesProvider.get('constants', 'Bookends')
                        ]
                    }, function (error) {
                        $log.info('Failed to load bookEndsDependencies: ' + error);
                    })
                        .then(function () {
                        return $injector.get('bookendService');
                    });
                }
            ],
            bookendSetup: [
                '$timeout',
                '$state',
                'stepService',
                'EaseConstant',
                function ($timeout, $state, stepService, EaseConstant) {
                    if (!stepService.getIsInitialized()) {
                        $timeout(function () {
                            $state.go(EaseConstant.states.kWelcome);
                        }, 0);
                    }
                    return;
                }
            ],
            bookendDependencies: [
                'bookendElementFeatureToggle',
                '$ocLazyLoad',
                '$log',
                function (bookendElementFeatureToggle, $ocLazyLoad, $log) {
                    if (bookendElementFeatureToggle) {
                        return;
                    }
                    return $ocLazyLoad.load({
                        name: 'bookendModule',
                        files: [
                            easeCoreFilesProvider.getComponent('Bookends', 'Account-bookend-component'),
                            easeCoreFilesProvider.getComponent('Bookends', 'Step-bookend-component')
                        ]
                    }, function (error) {
                        $log.info('Failed to load bookEndsDependencies: ' + error);
                    });
                }
            ]
        };
        var frontBookResolveBlock = {
            ngElementDependencies: [
                'angularElementsUtils',
                'bookendElementFeatureToggle',
                function (angularElementsUtils, bookendElementFeatureToggle) {
                    if (!bookendElementFeatureToggle) {
                        return;
                    }
                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                        return angularElementsUtils.getAngularElementsFeature(['ease-web-core-account-setup']);
                    });
                }
            ],
            adobeTargetRequest: [
                'adobeCampaignUtils',
                'EaseConstant',
                function (adobeCampaignUtils, EaseConstant) {
                    return adobeCampaignUtils
                        .globalOffersCall(EaseConstant.kAdobeTargetGlobalMbox, { baseline: EaseConstant.kAdobeBaselines.frontBookendModalOptions })
                        .then(function (response) { return response; }, function (err) { return undefined; });
                }
            ],
            overideI18n: [
                'adobeCampaignUtils',
                'EaseConstant',
                'adobeTargetRequest',
                'i18nContent',
                function (adobeCampaignUtils, EaseConstant, adobeTargetRequest, i18nContent) {
                    if (adobeTargetRequest) {
                        var adobeOffer = adobeCampaignUtils.parseAdobeTargetFullResponse(adobeTargetRequest, EaseConstant.kAdobeActivities.asuFrontBookendHeaders, true);
                        if (adobeOffer && adobeOffer.length) {
                            adobeOffer.forEach(function (offer) {
                                if (offer.values) {
                                    Object.keys(offer.values).forEach(function (key) {
                                        i18nContent[key] = offer.values[key];
                                    });
                                }
                            });
                        }
                    }
                }
            ],
            masuTargetOffers: [
                'bookendElementFeatureToggle',
                'adobeCampaignUtils',
                'EaseConstant',
                'stepService',
                'stepsGuard',
                function (bookendElementFeatureToggle, adobeCampaignUtils, EaseConstant, stepService, stepsGuard) {
                    var isMultiAccountSetup = stepService.asuBookendStepList.isMultiAccountSetup();
                    if (!bookendElementFeatureToggle || !isMultiAccountSetup) {
                        return;
                    }
                    return adobeCampaignUtils
                        .globalOffersCall(EaseConstant.kAdobeTargetGlobalMbox, { baseline: EaseConstant.kAdobeBaselines.frontBookendMasu }, EaseConstant.features.adobeTargetFeature)
                        .then(function (response) { return response; }, function (error) { return undefined; });
                }
            ],
            masuFrontBookendExperience: [
                'masuTargetOffers',
                'adobeCampaignUtils',
                'EaseConstant',
                function (masuTargetOffers, adobeCampaignUtils, EaseConstant) {
                    var noOfferForMultiAccountSetup = !masuTargetOffers;
                    // default experience for both single and masu
                    var controlExperience = 'A';
                    if (noOfferForMultiAccountSetup) {
                        return controlExperience;
                    }
                    var adobeExperience = adobeCampaignUtils.parseAdobeTargetFullResponse(masuTargetOffers, EaseConstant.kAdobeActivities.masuFrontBookend);
                    return adobeExperience && adobeExperience.experience ? adobeExperience.experience : controlExperience;
                }
            ],
            modalCloseOption: [
                'adobeCampaignUtils',
                'adobeTargetRequest',
                'EaseConstant',
                'stepService',
                function (adobeCampaignUtils, adobeTargetRequest, EaseConstant, stepService) {
                    var adobeExperience = adobeCampaignUtils.parseAdobeTargetFullResponse(adobeTargetRequest, EaseConstant.kAdobeActivities.asuCloseButton);
                    if (adobeExperience && adobeExperience.values) {
                        stepService.adobeTargetModalOptions = __assign({}, stepService.adobeTargetModalOptions, adobeExperience.values);
                    }
                }
            ]
        };
        var backBookResolveBlock = {
            ngElementDependencies: [
                'angularElementsUtils',
                'bookendElementFeatureToggle',
                function (angularElementsUtils, bookendElementFeatureToggle) {
                    if (!bookendElementFeatureToggle) {
                        return;
                    }
                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                        return angularElementsUtils.getAngularElementsFeature(['ease-web-core-account-setup']);
                    });
                }
            ],
            overideI18n: [
                'adobeCampaignUtils',
                'EaseConstant',
                'i18nContent',
                function (adobeCampaignUtils, EaseConstant, i18nContent) {
                    adobeCampaignUtils;
                    return adobeCampaignUtils
                        .globalOffersCall(EaseConstant.kAdobeTargetGlobalMbox, {
                        baseline: EaseConstant.kAdobeBaselines.backBookend
                    })
                        .then(function (response) {
                        adobeCampaignUtils.overrideI18nContent(response, 'asuBackBookendHeader', true);
                    }, function (err) { return undefined; });
                }
            ]
        };
        this.set = function (parentName, frontName, backName) {
            front = angularDynamicRouteProvider.createState({
                name: frontName,
                parent: parentName,
                url: '/frontbookend',
                title: i18nContent['ease.core.accountsetup.title'],
                angularFeatureToggles: ['ease.core.campaign.bookend.element'],
                angularDependencies: ['ease-web-core-account-setup'],
                angularJsState: {
                    resolve: __assign({}, _this.baseResolveBlock, frontBookResolveBlock),
                    onEnter: [
                        'bookendService',
                        'EaseConstant',
                        'masuFrontBookendExperience',
                        function (bookendService, EaseConstant, masuFrontBookendExperience) {
                            bookendService.OpenModal(EaseConstant.stepType.frontBook, true, masuFrontBookendExperience);
                        }
                    ]
                },
                angularState: {
                    resolve: {
                        angularPortOfStepsGuard: [
                            'stepService',
                            function (stepService) {
                                /* Send the user to AccountSummary if the user is not in the Account Set Up flow */
                                return stepService.stepsRouteGuard();
                            }
                        ]
                    },
                    template: "<c1-element-core-features-account-setup-front-bookend-content></c1-element-core-features-account-setup-front-bookend-content>"
                }
            });
            back = angularDynamicRouteProvider.createState({
                parent: parentName,
                url: '/backbookend',
                name: backName,
                title: i18nContent['ease.core.accountsetup.title'],
                angularFeatureToggles: ['ease.core.campaign.bookend.element'],
                angularDependencies: ['ease-web-core-account-setup'],
                angularJsState: {
                    resolve: __assign({}, _this.baseResolveBlock, backBookResolveBlock),
                    onEnter: [
                        'bookendService',
                        'EaseConstant',
                        'bookendElementFeatureToggle',
                        function (bookendService, EaseConstant, bookendElementFeatureToggle) {
                            bookendService.OpenModal(EaseConstant.stepType.backBook, bookendElementFeatureToggle);
                        }
                    ]
                },
                angularState: {
                    resolve: {
                        angularPortOfStepsGuard: [
                            'stepService',
                            function (stepService) {
                                /* Send the user to AccountSummary if the user is not in the Account Set Up flow */
                                return stepService.stepsRouteGuard();
                            }
                        ]
                    },
                    template: "<c1-element-core-features-account-setup-back-bookend></c1-element-core-features-account-setup-back-bookend>"
                }
            });
        };
        this.get = function () {
            return { front: front, back: back };
        };
        this.$get = function () {
            return _this;
        };
    }
    angular.module('BookendModule', []).provider('BookendState', bookendState);
});
