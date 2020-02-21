define(['angular'], function (angular) {
    var WelcomeModule = angular.module('WelcomeModule', ['ct.ui.router.extras.future', 'i18nModule', 'TaxLinks']);
    WelcomeModule.config(config)
        .controller('WelcomeController', WelcomeController)
        .controller('EscidController', EscidController);
    config.$inject = ['$stateProvider', 'easeTemplatesProvider', '$urlRouterProvider', '$futureStateProvider', 'EaseConstant'];
    function config($stateProvider, easeTemplatesProvider, $urlRouterProvider, $futureStateProvider, EaseConstant) {
        $stateProvider.state('welcome', {
            resolve: {
                c1TargetCookie: [
                    'appCookie',
                    function (appCookie) {
                        return appCookie.getHttpOnly(EaseConstant.cookies.kNavigation);
                    }
                ]
            },
            data: {
                hideBackButton: true,
                doNotRefreshGlobalMessages: true
            },
            url: '/welcome',
            templateUrl: easeTemplatesProvider.get('Welcome'),
            controller: 'WelcomeController',
            controllerAs: 'welcome',
            title: 'Welcome'
        });
        $stateProvider.state('escid', {
            params: {
                value: ''
            },
            templateUrl: easeTemplatesProvider.get('Welcome', '', 'Escidindex'),
            controller: 'EscidController',
            controllerAs: 'escid'
        });
        $urlRouterProvider.when(EaseConstant.states.kCreditCardDeepLinkUrl, [
            '$state',
            '$interval',
            function ($state, $interval) {
                var checkFutureStates = $interval(function () {
                    var futureStates = $futureStateProvider.get();
                    if (!_.isEmpty(futureStates)) {
                        $interval.cancel(checkFutureStates);
                        $state.go(EaseConstant.states.kCreditCardDeepLink);
                    }
                }, 100);
            }
        ]);
    }
    EscidController.$inject = ['$stateParams', 'i18nContent'];
    function EscidController($stateParams, i18nContent) {
        var vm = this;
        vm.i18nContent = i18nContent;
        vm.escidMessage = $stateParams.value.displayMessage;
    }
    WelcomeController.$inject = [
        '$state',
        'EaseConstant',
        'pubsubService',
        'appCookie',
        '$location',
        'summaryService',
        'featureToggleFactory',
        'stepService',
        'EASEUtilsFactory',
        'c1TargetCookie',
        '$log',
        'TaxLinks',
        '$window',
        'pluginsService',
        '$rootScope',
        'messagingService'
    ];
    function WelcomeController($state, EaseConstant, pubsubService, appCookie, $location, summaryService, featureToggleFactory, stepService, EASEUtilsFactory, c1TargetCookie, $log, TaxLinks, $window, pluginsService, $rootScope, messagingService) {
        var vm = this;
        var isCore = false;
        summaryService.addNoCacheHeader = true;
        var navigationParams = c1TargetCookie;
        var listener = $rootScope.$on('$stateChangeSuccess', function () {
            if (navigationParams &&
                navigationParams.plugin === 'enoChat' &&
                typeof pluginsService.pluginMap[EaseConstant.enoChat] === 'function') {
                pluginsService.pluginMap[EaseConstant.enoChat]();
            }
            listener();
        });
        if (navigationParams && navigationParams.action && navigationParams.product) {
            var deepLinkString = navigationParams.action.toLowerCase();
            var deepLinkParentActionSeparator = deepLinkString.lastIndexOf('/');
            var deepLinkAction_1 = deepLinkString.substring(deepLinkParentActionSeparator + 1, deepLinkString.length);
            var deepLinkParent_1 = deepLinkString.substring(0, deepLinkParentActionSeparator);
            var deepLinkProduct_1 = navigationParams.product.toLowerCase();
            if (navigationParams.campaignid) {
                pubsubService.pubsubTrackAnalytics({ campaignID: navigationParams.campaignid });
            }
            if (navigationParams.action === 'LinkAccount') {
                EASEUtilsFactory.redirectToAutoLoanAccountLinking(undefined, navigationParams.acctrefid);
                return;
            }
            var deepLinkState = getDeepLinkState(deepLinkProduct_1, deepLinkAction_1);
            if (deepLinkState) {
                navigateToDeepLinkState(deepLinkState);
                appCookie.deleteHttpOnly(EaseConstant.cookies.kNavigation);
                return;
            }
            else {
                // deep links currently depend on url fragments and is not robust
                // you can prevent collisions by disabling deeplinks via the state definition
                var deepLinkableStates = $state.get().filter(function (state) { return !(state && state.data && state.data.disableDeeplink); });
                deepLinkableStates.some(function (state) {
                    if (state && state.url && state.url.toLowerCase().indexOf(deepLinkAction_1) >= 0) {
                        isCore = true;
                        if (navigationParams.acctrefid && navigationParams.acctrefid.length > 4) {
                            $location.url('/' + EaseConstant.states.kAccountSummary + '/' + navigationParams.acctrefid + '/' + navigationParams.action);
                            appCookie.deleteHttpOnly(EaseConstant.cookies.kNavigation);
                        }
                        else {
                            if ((navigationParams.action.toLowerCase() === 'pay' && deepLinkProduct_1 === 'card') ||
                                (deepLinkProduct_1 === 'card' && navigationParams.acctrefid && navigationParams.acctrefid.length < 5)) {
                                isCore = false;
                            }
                            else if (navigationParams.action.toLowerCase() === 'tax' && (deepLinkProduct_1 === 'retail' || deepLinkProduct_1 === '360')) {
                                isCore = false;
                            }
                            else if (deepLinkParent_1) {
                                if (state.parent && state.parent.url && state.parent.url.toLowerCase().indexOf(deepLinkParent_1) >= 0) {
                                    navigateToDeepLinkState(state.name);
                                    appCookie.deleteHttpOnly(EaseConstant.cookies.kNavigation);
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                navigateToDeepLinkState(state.name);
                                appCookie.deleteHttpOnly(EaseConstant.cookies.kNavigation);
                            }
                        }
                        return true;
                    }
                    return false;
                });
            }
            if (!isCore) {
                switch (deepLinkProduct_1) {
                    case 'card': {
                        $location.url(EaseConstant.states.kCreditCardDeepLinkUrl);
                        break;
                    }
                    case 'enterprise': {
                        appCookie.deleteHttpOnly(EaseConstant.cookies.kNavigation);
                        goToAccountSummary();
                        break;
                    }
                    case 'retail':
                    case '360': {
                        appCookie.deleteHttpOnly(EaseConstant.cookies.kNavigation);
                        $window.open(TaxLinks[deepLinkProduct_1], '_self');
                        break;
                    }
                    default: {
                        var navigationParamsAcctRefId = navigationParams.acctrefid.replace(/\//g, '%252F');
                        $location.url('/' + navigationParams.product + '/' + navigationParamsAcctRefId + '/' + navigationParams.action);
                    }
                }
            }
        }
        else {
            // Do we make this call when a customer is deeplinked?
            // We currently do not in prod
            messagingService.initGlobalMessages(true);
            summaryService.set().then(function () {
                summaryService.inSessionAlready = true;
                var features = featureToggleFactory.getFeatureToggleData();
                if (features[EaseConstant.features.enableSteps] && !features[EaseConstant.features.enableHarmonyAsu]) {
                    stepService.initSteps({ stepFlowMode: 'ftux' }).then(showFrontBook, function (_) {
                        goToAccountSummary();
                    });
                }
                else {
                    goToAccountSummary();
                }
            });
        }
        function navigateToDeepLinkState(stateName) {
            $state.go(stateName).catch(function (err) {
                $log.error('Deep link error: ', err);
                if ($state.current.name === EaseConstant.states.kWelcome) {
                    $log.error('User still on welcome. Navigating to accountSummary');
                    goToAccountSummary();
                }
            });
        }
        function getDeepLinkState(deepLinkProduct, deepLinkAction) {
            var deepLinkStates = EaseConstant.deepLinkStates;
            var productDeepLinkStates = deepLinkStates ? deepLinkStates[deepLinkProduct] : null;
            var productDeepLinkState = productDeepLinkStates ? productDeepLinkStates[deepLinkAction] : null;
            return productDeepLinkState || deepLinkStates.default[deepLinkAction];
        }
        function showFrontBook() {
            return stepService.startStepsExperience('ftux').then(function (wasStepsStarted) {
                if (!wasStepsStarted) {
                    return goToAccountSummary();
                }
            });
        }
        function goToAccountSummary() {
            $state.go(EaseConstant.states.kAccountSummary);
        }
    }
});
