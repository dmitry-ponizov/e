'use strict';
function getRequireJsDeps() {
    return [
        'require',
        'angular',
        'coreloader',
        'adobeVisitorAPI',
        'adobeTarget',
        'easeUIComponents',
        'easeCoreUtils',
        'WelcomeModule',
        'UMMModule',
        'TransferModule',
        'TransferExternalAccountModule',
        'AccountDetailModule',
        'SummaryHeaderModule',
        'GlobalFooterModule',
        'customerSettings',
        'personalInformationModule',
        'SecurityModule',
        'SessionTimeoutModule',
        'EscapeHatchModule',
        'AccountSummaryModule',
        'LanguageToggleService',
        'LogoutModule',
        'AlertsModule',
        'coreFeatures',
        'EnoModule',
        'ngStorage',
        'CampaignModule',
        'BookendModule',
        'OtpModule',
        'OtpService',
        'PaperlessModule',
        'EnoChatModule',
        'EnoExtension',
        'StepModule',
        'UpdateInfoModule',
        'LogoutInterstitialModule',
        'LogoutInterstitialService',
        'AccountSetupLaunchModule',
        'DocumentCenterModule',
        'ProfileHubModule',
        'AccountLinkingModule',
        'ProductOfferModule',
        'StoreModule'
    ];
}
define(getRequireJsDeps(), function (require, angular, coreloader) {
    // If in mobile web view, don't load usabilla
    if (!coreloader.isNativeMobileApp()) {
        require(['optional!usabilla'], function () {
            'usabilla_live' in window && window.usabilla_live('hide');
        });
    }
    var Environment;
    (function (Environment) {
        Environment["QA"] = "qa";
        Environment["REG"] = "reg";
        Environment["STAGING"] = "myaccounts-verify.capitalone.com";
        Environment["PROD"] = "myaccounts.capitalone.com";
        Environment["DEV"] = "dev";
        Environment["PREVIEW"] = "cloudwld";
    })(Environment || (Environment = {}));
    var customAttributes = {
        logLevel: '',
        tealeafSessionId: coreloader.getTealeaf(),
        nativeMobileAppUser: coreloader.isNativeMobileApp().toString(),
        locale: coreloader.getLocale(),
        country: coreloader.getCountry()
    };
    function getEaseAngularDeps() {
        return [
            'ngAnimate',
            'ngAria',
            'ngSanitize',
            'ngStorage',
            'ui.router',
            'ct.ui.router.extras.future',
            'oc.lazyLoad',
            'restangular',
            'ngIdle',
            'EaseProperties',
            'ContentProperties',
            'i18nModule',
            'EaseExceptionsModule',
            'pubsubServiceModule',
            'easeTemplates',
            'easeAppUtils',
            'easeAccordion',
            'accountServicesModule',
            'EaseLocalizeModule',
            'CommonModule',
            'EaseDatePicker',
            'easeMultiDateSelector',
            'easeDateRangePicker',
            'Easetooltip',
            'easeDropdownModule',
            'filterComponent',
            'EaseModalModule',
            'GlobalFooterModule',
            'SummaryHeaderModule',
            'customerSettingsModule',
            'personalInformationModule',
            'SecurityModule',
            'SessionTimeoutModule',
            'EscapeHatchModule',
            'easeUIComponents',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'LanguageToggleModule',
            'UniversalTranslateModule',
            'WelcomeModule',
            'LogoutModule',
            'AccountDetailsModule',
            'AlertsModule',
            'coreFeatures',
            'EnoModule',
            'CampaignModule',
            'BookendModule',
            'OtpModule',
            'EnoChatModule',
            'StepModule',
            'UpdateInfoModule',
            'LogoutInterstitialModule',
            'DocumentCenterModule',
            'ProfileHubModule',
            'AccountLinkingModule',
            'ProductOfferModule',
            'StoreModule'
        ];
    }
    configFn.$inject = [
        '$stateProvider',
        '$futureStateProvider',
        '$ocLazyLoadProvider',
        '$urlRouterProvider',
        'EaseConstant',
        'KeepaliveProvider',
        'IdleProvider',
        '$translateProvider',
        '$locationProvider',
        '$windowProvider',
        '$compileProvider',
        'languagePreferencesFactoryProvider',
        'tmhDynamicLocaleProvider',
        '$urlMatcherFactoryProvider'
    ];
    function configFn($stateProvider, $futureStateProvider, $ocLazyLoadProvider, $urlRouterProvider, EaseConstant, KeepaliveProvider, IdleProvider, $translateProvider, $locationProvider, $windowProvider, $compileProvider, i18nProvider, tmhDynamicLocaleProvider, $urlMatcherFactoryProvider) {
        $urlMatcherFactoryProvider.caseInsensitive(true);
        i18nProvider.initLocalizationPreferences(coreloader.getLocale(), coreloader.getCountry());
        !!history.pushState ? $locationProvider.html5Mode(true) : $locationProvider.html5Mode(false);
        $ocLazyLoadProvider.config({
            jsLoader: require
        });
        $futureStateProvider.stateFactory('ocLazyload', ocLazyLoadStateFactory);
        EaseConstant.futureStates.map($futureStateProvider.futureState);
        configureIdleandKeepaliveProvider(IdleProvider, KeepaliveProvider, EaseConstant);
        configureTranslateProvider($translateProvider, EaseConstant);
        configureLocaleProvider(tmhDynamicLocaleProvider, EaseConstant);
        var window = $windowProvider.$get();
        window.document.body.addEventListener('touchend', function () {
            IdleProvider.idle(EaseConstant.kIdleTime);
        }, false);
        var mainState = {
            name: 'mainState',
            url: '/*path',
            onEnter: function ($injector) {
                var summaryService = $injector.get('summaryService');
                var EASEUtilsFactory = $injector.get('EASEUtilsFactory');
                EASEUtilsFactory.defaultHandler(summaryService);
            }
        };
        $stateProvider.state(mainState);
        // End
    }
    runFn.$inject = [
        '$rootScope',
        'pubsubService',
        'easeEvent',
        '$state',
        'adobeCampaignUtils',
        'deeplinkUtils',
        'summaryService',
        '$templateCache',
        'Idle',
        'EASEUtilsFactory',
        'languageToggleService',
        'featureToggleFactory',
        'EaseConstant',
        '$timeout',
        '$window',
        '$location',
        'ContentConstant',
        'appCookie',
        'dateLocalizationService',
        '$translate',
        'languagePreferencesFactory',
        'tmhDynamicLocale',
        '_',
        'ChatService',
        'i18nContent',
        '$document',
        'environmentUtils',
        'usabillaUtils',
        '$q',
        'pluginsService',
        'Restangular',
        'angularElementsUtils',
        'Store'
    ];
    function runFn($rootScope, pubsubService, easeEvent, $state, adobeCampaignUtils, deeplinkUtils, summaryService, $templateCache, Idle, EASEUtilsFactory, languageToggleService, featureToggleFactory, EaseConstant, $timeout, $window, $location, ContentConstant, appCookie, dateLocalizationService, $translate, languagePreferencesFactory, tmhDynamicLocale, _, ChatService, i18nContent, $document, environmentUtils, usabillaUtils, $q, pluginsService, Restangular, angularElementsUtils, store) {
        /*
         * Safety check to ensure __EASE_SHAED_CONTEXT__ is present.
         */
        window.__EASE_SHARED_CONTEXT__ = window.__EASE_SHARED_CONTEXT__ || {};
        appCookie.getProfileRefId(EaseConstant.cookies.kProfRefIdCookie).then(function (profileRefIdCookie) {
            var profileReferenceID = encodeURIComponent(profileRefIdCookie);
            // For more Info visit: https://marketing.adobe.com/resources/help/en_US/target/ov2/c_atjs-settings-override.html
            (function () {
                window.targetGlobalSettings = {
                    globalMboxAutoCreate: false,
                    bodyHidingEnabled: false
                };
                window.targetPageParamsAll = function () {
                    return "mbox3rdPartyId=" + profileReferenceID;
                };
            })();
        });
        //Getting all the Core A/B test
        adobeCampaignUtils.globalOffersCall(EaseConstant.kAdobeTargetGlobalMbox, { baseline: 'core' });
        // Necessary to load ngElement footer feature
        angularElementsUtils.getAngularElementsDependencies().then(function () {
            return angularElementsUtils.getAngularElementsFeature(['ease-web-core-global-footer']);
        });
        // Necessary to load Card Features on the L1
        angularElementsUtils.getAngularElementsDependencies().then(function () {
            return angularElementsUtils.getAngularElementsFeature(['ease-web-card-shared-state']);
        });
        // remove following once all ajax calls move to EaseCoreRestangular
        Restangular.setBaseUrl(EaseConstant.baseUrl);
        //Pubsub event
        var cntrLocale = languagePreferencesFactory.getCurrentLocale();
        var cntrMessage = "Country Indicator States | " + coreloader.getCountrySource() + " | " + coreloader.getCountry() + " | " + coreloader.getLocale() + " | " + cntrLocale;
        var sCountry = "sc | " + coreloader.getCountryForLogs();
        pubsubService.pubsubTrackAnalytics({
            taxonomy: {
                level1: 'ease',
                level2: 'welcome',
                level3: '',
                level4: '',
                level5: '',
                country: sCountry,
                language: 'english',
                system: coreloader.getSiteCatalystSystem()
            },
            scDLLevel2: 'login',
            name: cntrMessage,
            tealeafSessionId: coreloader.getTealeaf()
        });
        environmentUtils.determineCurrentEnvironment();
        $rootScope.$state = $state;
        pubsubService.setCurrentParent($state.current);
        $translate.use(languagePreferencesFactory.getCurrentLocale());
        var usabillaData = {};
        if (languagePreferencesFactory.getCurrentLocale() !== EaseConstant.kEnglishLocale.toLowerCase()) {
            tmhDynamicLocale.set(languagePreferencesFactory.getCurrentLocale().toLowerCase());
        }
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState) {
            var isOnLoginPage = /login/.test(toState.name);
            //Todo: enter and exit functionalities, need to tie these into site Catalyst when we get the params
            if ($location.url().indexOf(EaseConstant.deeplinkTrigger) !== -1) {
                e.preventDefault();
                deeplinkUtils.detokenizeDeeplinkUrl($location.url());
            }
            else {
                easeEvent.exiting({
                    type: 'exit',
                    event: fromState.name
                });
                easeEvent.entering({
                    type: 'entry',
                    event: toState.name
                });
            }
            if (isOnLoginPage) {
                Idle.unwatch();
            }
            else {
                Idle.watch();
            }
        });
        $rootScope.$on('$stateChangeError', function (e) {
            e.preventDefault();
        });
        var pageTitle = i18nContent[ContentConstant.kCoreGlobalHeaderPageTitle];
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (coreloader.isNativeMobileApp()) {
                /*
                  Webview window.close events will not work if there is any browser history.
                  Using location.replace prevents the state change from adding to the
                  history stack. This is what $state.go(foo, bar, {location: 'replace'}) uses
                  This should be deleted once mobile roles out a platform solution
                */
                $location.replace();
            }
            if ($state.current.title) {
                $rootScope.title = pageTitle + ' | ' + $state.current.title;
            }
            // To get the Previous State Name
            usabillaUtils.sendStateChangeEvent({ 'Previous State Name': fromState.name });
            $state.previous = fromState.name;
            if ($state.current && $state.current.pageViewObject) {
                var currentParent = pubsubService.getCurrentParent();
                if (currentParent.name !== '' && $state.includes(currentParent) && !$state.is(currentParent)) {
                    pubsubService.pageView($state.current.pageViewObject, true);
                }
                else {
                    pubsubService.setCurrentParent($state.current);
                    pubsubService.pageView($state.current.pageViewObject, false);
                }
            }
        });
        $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
            // To get the Previous URL
            usabillaUtils.sendUsabillaCustomData({ 'Previous URL': oldUrl });
        });
        var customerPlatformEvent = $rootScope.$on('customerPlatFormReady', function (evt, args) {
            var sessionId = appCookie.read('TLTSID');
            var profileReferenceID;
            appCookie.getHttpOnly(EaseConstant.cookies.kProfRefIdCookie).then(function (cookie) {
                profileReferenceID = decodeURIComponent(cookie);
                if (isLoadAdobeTarget && !coreloader.isNativeMobileApp()) {
                    require(['optional!adobeTarget'], loadUsabilla);
                }
                else {
                    loadUsabilla();
                }
            });
            var featureToggleData = featureToggleFactory.getFeatureToggleData();
            var isUsabillaButtonDisplay = featureToggleData[EaseConstant.features.usabillaFeature];
            var isEscapeHatchDisplay = featureToggleData[EaseConstant.features.enableEscapeHatch];
            var isLoadAdobeTarget = featureToggleData[EaseConstant.features.adobeTargetFeature];
            var isLoadChat247 = featureToggleData[EaseConstant.features.chat247];
            if (isUsabillaButtonDisplay) {
                'usabilla_live' in $window && $window.usabilla_live(isUsabillaButtonDisplay ? 'show' : 'hide');
                // To select correct for depending on locale
                usabillaUtils.formLocales();
            }
            if (isLoadChat247 && !coreloader.isNativeMobileApp()) {
                ChatService.initiateChat();
            }
            function loadUsabilla() {
                if (isUsabillaButtonDisplay) {
                    usabillaData.SessionId = sessionId;
                    usabillaData.profileReferenceID = profileReferenceID;
                }
                if (isEscapeHatchDisplay) {
                    usabillaData.SPI = args ? args.customerPlatform : '';
                    usabillaData['Card Customer'] = args
                        ? /EOS/i.test(args.customerPlatform) || /COS/i.test(args.customerPlatform)
                            ? 'Yes'
                            : 'No'
                        : 'Unknown';
                }
                $timeout(function () {
                    usabillaUtils.sendUsabillaCustomData(usabillaData);
                }, 500);
            }
            customerPlatformEvent();
        });
        languageToggleService.registerRefreshOnTranslateAddPartEvent();
        languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent();
        languageToggleService.registerThrowErrorOnTranslateLoadFailureEvent();
        // Load the selected locale for the Date Localization Service
        dateLocalizationService.loadLocale(languagePreferencesFactory.getCurrentLocale());
    }
    function ocLazyLoadStateFactory($q, $ocLazyLoad, futureState) {
        var deferred = $q.defer();
        $ocLazyLoad.load(futureState.src).then(function () {
            deferred.resolve();
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    /**
     * Configure Angular Translate.
     *
     * @param $translateProvider the provider to configure.
     * @param EaseConstant Constants for Ease
     */
    function configureTranslateProvider($translateProvider, EaseConstant) {
        $translateProvider.useLoader('UniversalTranslate', {
            baseUrl: EaseConstant.baseUrl
        });
        var availableLocaleKeys = ['en_US', 'es_US', 'en_CA', 'fr_CA'];
        var availableLocaleAliases = {
            'en-US': 'en_US',
            'es-US': 'es_US',
            'en-CA': 'en_CA',
            'fr-CA': 'fr_CA'
        };
        $translateProvider.registerAvailableLanguageKeys(availableLocaleKeys, availableLocaleAliases);
        $translateProvider.preferredLanguage('en_US');
        $translateProvider.useLoaderCache(true);
        $translateProvider.useMissingTranslationHandler('languageToggleMissingTranslationHandler');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
    }
    function configureLocaleProvider(tmhDynamicLocaleProvider, EaseConstant) {
        tmhDynamicLocaleProvider.localeLocationPattern('ease-ui' + EaseConstant.kBuildVersionPath + '/bower_components/angular/i18n/angular-locale_{{locale}}.js');
    }
    function configureIdleandKeepaliveProvider(IdleProvider, KeepaliveProvider, EaseConstant) {
        IdleProvider.idle(EaseConstant.kIdleTime);
        IdleProvider.timeout(EaseConstant.kTimeoutTime);
        KeepaliveProvider.http(EaseConstant.baseUrl + EaseConstant.keepaliveUrl);
        KeepaliveProvider.interval(EaseConstant.keepaliveInterval);
    }
    configLogFn.$inject = ['$provide', '$windowProvider'];
    function configLogFn($provide, $windowProvider) {
        logDecoratorFn.$inject = ['$delegate'];
        var window = $windowProvider.$get();
        var ENV = getEnvironmentFromHost(window.location.hostname);
        var newrelic = window && window.newrelic ? window.newrelic : null;
        function logDecoratorFn($delegate) {
            var debugEnabled = sessionStorage.getItem('ease_debug') === 'true' ||
                localStorage.getItem('ease_debug') === 'true' ||
                window.location.href.indexOf('debug') >= 0;
            if (!debugEnabled &&
                (ENV === Environment.REG ||
                    ENV === Environment.QA ||
                    ENV === Environment.PROD ||
                    ENV === Environment.PREVIEW ||
                    ENV === Environment.STAGING)) {
                $delegate.log = function () {
                    var message = Array.prototype.join.call(arguments, ' ');
                    sendDataToNewRelic('log', message, customAttributes);
                };
                $delegate.info = function () {
                    var message = Array.prototype.join.call(arguments, ' ');
                    sendDataToNewRelic('info', message, customAttributes);
                };
                $delegate.warn = function () {
                    var message = Array.prototype.join.call(arguments, ' ');
                    sendDataToNewRelic('warn', message, customAttributes);
                };
                $delegate.error = function () {
                    var message = Array.prototype.join.call(arguments, ' ');
                    sendDataToNewRelic('error', message, customAttributes);
                };
                $delegate.debug = function () {
                    var message = Array.prototype.join.call(arguments, ' ');
                    sendDataToNewRelic('debug', message, customAttributes);
                };
            }
            else {
                $delegate.log = console.log.bind(console);
                $delegate.info = console.info.bind(console);
                $delegate.warn = console.warn.bind(console);
                $delegate.error = console.error.bind(console);
                $delegate.debug = console.debug.bind(console);
            }
            return $delegate;
        }
        function getEnvironmentFromHost(hostname) {
            var returnEnv = Environment.DEV;
            Object.keys(Environment).forEach(function (key) {
                if (hostname.indexOf(Environment[key]) > -1) {
                    returnEnv = Environment[key];
                }
            });
            return returnEnv;
        }
        function sendDataToNewRelic(logLevel, message, customAttributes) {
            customAttributes.logLevel = logLevel;
            if (newrelic) {
                newrelic.noticeError(message, customAttributes);
            }
        }
        $provide.decorator('$log', logDecoratorFn);
    }
    return angular
        .module('EASEApp', getEaseAngularDeps())
        .config(configFn)
        .config(configLogFn)
        .run(runFn);
});
