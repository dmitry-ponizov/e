define(['angular'], function (angular) {
    'use strict';
    var InterstitialMessageModule = angular
        .module('InterstitialMessageModule', ['easeAppUtils'])
        .constant('InterstitialMessageConstants', {
        interstitialModalUrl: '/ease-ui/dist/features/InterstitialMessage/html/interstitial-modal.html'
    })
        .factory('InterstitialMessageService', InterstitialMessageService);
    InterstitialMessageService.$inject = [
        'easeUIModalService',
        '$ocLazyLoad',
        'InterstitialMessageConstants',
        '$log',
        'messagingService',
        'EaseConstant',
        'RoutingUtils',
        '$state',
        'featureToggleFactory',
        'easeCoreFiles',
        '_',
        'harmonyAccountSetupUtils',
        'angularElementsUtils',
        '$compile',
        '$rootScope'
    ];
    function InterstitialMessageService(easeUIModalService, $ocLazyLoad, InterstitialMessageConstants, $log, messagingService, EaseConstant, RoutingUtils, $state, featureToggleFactory, easeCoreFiles, _, harmonyAccountSetupUtils, angularElementsUtils, $compile, $rootScope) {
        var _this = this;
        // parse query params and get the 'feature' from it
        var _getModalOneClickParams = function (interstitialMessage) {
            var queryParamsString = interstitialMessage && interstitialMessage.path ? interstitialMessage.path.split('?').pop() : null;
            return RoutingUtils.getParams(queryParamsString);
        };
        var _formatModalOneClick = function (interstitialMessage) {
            var submitButton = _.get(interstitialMessage, ['buttons', 0]);
            var dismissButton = _.get(interstitialMessage, ['buttons', 1]);
            return {
                title: interstitialMessage.headLine,
                subtitle: interstitialMessage.subheadline,
                iconUrl: _.get(interstitialMessage, ['media', 0, 'path']),
                submitButton: submitButton
                    ? {
                        value: submitButton.value,
                        responseType: submitButton.responseType
                    }
                    : null,
                dismissButton: dismissButton
                    ? {
                        value: dismissButton.value,
                        responseType: dismissButton.responseType
                    }
                    : null,
                respondToMessageUrl: interstitialMessage.responseUrlHref
            };
        };
        this.addExternalInterstitialFiles = function () {
            return featureToggleFactory.initializeFeatureToggleData().then(function (featureToggleData) {
                if (featureToggleData[EaseConstant.features.enableInterstitialModal]) {
                    return $ocLazyLoad.load({
                        name: 'interstitialModule',
                        files: [easeCoreFiles.get('controller', 'InterstitialMessage')]
                    }, function (error) {
                        $log.log('Failed to load interstitial dependencies: ' + error);
                    });
                }
            });
        };
        // deprecated: called by Details Controller (card)
        this.openTwoClickInterstitial = function (interstitialMessage, needsFormatting, queryParams) {
            if (needsFormatting === void 0) { needsFormatting = true; }
            if (queryParams === void 0) { queryParams = null; }
            return _this.openAngularInterstitial(interstitialMessage, needsFormatting, queryParams);
        };
        // called from Account Summary
        this.openAngularInterstitial = function (interstitialMessage, needsFormatting, queryParams) {
            if (needsFormatting === void 0) { needsFormatting = true; }
            if (queryParams === void 0) { queryParams = null; }
            return featureToggleFactory
                .initializeFeatureToggleData()
                .then(function (featureToggleData) {
                var enableInterstitials = featureToggleData[EaseConstant.features.enableInterstitialModal];
                var interstitialTypeFeatureToggle = _this.isTwoClickInterstitial(interstitialMessage)
                    ? featureToggleData[EaseConstant.features.enableTwoClickInterstitialElement]
                    : featureToggleData[EaseConstant.features.enableOneClickInterstitialElement];
                if (!enableInterstitials) {
                    return;
                }
                return _this.loadInterstitialsFiles(interstitialTypeFeatureToggle);
            })
                .then(function (_a) {
                var wasLoaded = _a.wasLoaded, isAngular = _a.isAngular;
                if (!wasLoaded) {
                    return;
                }
                var formattedInterstitialMessage = needsFormatting
                    ? messagingService.formatHarmonyPageContent(interstitialMessage)
                    : interstitialMessage;
                if (isAngular) {
                    return _addInterstitialAngularElement(formattedInterstitialMessage, queryParams);
                }
                else {
                    return _this.initModal(formattedInterstitialMessage);
                }
            });
        };
        this.initModal = function (message) {
            easeUIModalService.showModal({
                templateUrl: InterstitialMessageConstants.interstitialModalUrl,
                controller: 'InterstitialMessageCtrl as modalCtrl',
                inputs: { message: message }
            });
        };
        function _addInterstitialAngularElement(message, queryParams) {
            var scope = $rootScope.$new();
            scope.message = message;
            scope.queryParams = queryParams;
            var html = $compile("\n      <c1-element-core-features-interstitials\n        ng-custom-element\n        ngce-prop-message=\"message\"\n        ngce-prop-query_params=\"queryParams\"\n      ></c1-element-core-features-interstitials>\n      ")(scope);
            angular.element(document.getElementsByTagName('body')).append(html);
        }
        this.handleInterstitialMessage = function (interstitialMessage) {
            if (!interstitialMessage || !messagingService.displayInterstitial()) {
                return;
            }
            _this.addExternalInterstitialFiles().then(function () {
                messagingService.wasInterModalShown = true;
                switch (interstitialMessage.messageLayout) {
                    case EaseConstant.retrieveMessageParams.messageLayout.pageOneClick:
                        if (interstitialMessage.path) {
                            var toState_1 = RoutingUtils.getStateFrom(interstitialMessage.path);
                            $state.go(toState_1.name, { isInterPage: true });
                        }
                        break;
                    case EaseConstant.retrieveMessageParams.messageLayout.modalOneClick:
                        var queryParams = _getModalOneClickParams(interstitialMessage);
                        _this.openAngularInterstitial(interstitialMessage, false, queryParams);
                        break;
                    case EaseConstant.retrieveMessageParams.messageLayout.personalizedPage:
                        if (interstitialMessage.messageStyle && interstitialMessage.path) {
                            var toState_2 = RoutingUtils.getStateFrom(interstitialMessage.path);
                            $state.go(toState_2.name, { isInterPage: true, interstitialMessageStyle: interstitialMessage.messageStyle });
                        }
                        break;
                    case EaseConstant.retrieveMessageParams.messageLayout.accountSetup:
                        messagingService.wasInterModalShown = false;
                        harmonyAccountSetupUtils.start();
                        break;
                    case EaseConstant.retrieveMessageParams.messageLayout.linkAccounts:
                        var toState = RoutingUtils.getStateFrom("/" + interstitialMessage.messageLayout);
                        $state.go(toState.name, { interstitialMessage: interstitialMessage });
                        break;
                }
            });
        };
        this.loadInterstitialsFiles = function (forAngular) {
            var loadInterstitialsFilePromise = forAngular ? _loadAngularInterstitialElement() : _loadAngularJSInterstitial();
            return loadInterstitialsFilePromise
                .then(function (interstitialFilesLoaded) {
                return {
                    isAngular: forAngular,
                    wasLoaded: interstitialFilesLoaded
                };
            })
                .catch(function () {
                return {
                    wasLoaded: false
                };
            });
        };
        this.isTwoClickInterstitial = function (interstitialMessage) {
            var interstitialLayoutList = [
                EaseConstant.retrieveMessageParams.messageLayout.pageOneClick,
                EaseConstant.retrieveMessageParams.messageLayout.modalOneClick,
                EaseConstant.retrieveMessageParams.messageLayout.personalizedPage,
                EaseConstant.retrieveMessageParams.messageLayout.accountSetup,
                EaseConstant.retrieveMessageParams.messageLayout.linkAccounts
            ];
            return (!!interstitialMessage &&
                (interstitialLayoutList.indexOf(interstitialMessage.messageLayout) === -1 ||
                    interstitialMessage.messageLayout === EaseConstant.retrieveMessageParams.messageLayout.modalTwoClick));
        };
        function _loadAngularInterstitialElement() {
            return angularElementsUtils.getAngularElementsDependencies().then(function () {
                return angularElementsUtils
                    .getAngularElementsFeature(['ease-web-core-interstitials'])
                    .then(function (response) { return !!response; }, function (error) { return false; })
                    .catch(function () { return false; });
            });
        }
        function _loadAngularJSInterstitial() {
            return $ocLazyLoad
                .load({
                name: 'interstitialModule',
                files: [easeCoreFiles.get('controller', 'InterstitialMessage')]
            }, function (error) {
                $log.log('Failed to load interstitial dependencies: ' + error);
                return {
                    isAngular: false,
                    wasLoaded: false
                };
            })
                .then(function () {
                return {
                    isAngular: false,
                    wasLoaded: true
                };
            });
        }
        return this;
    }
    return InterstitialMessageModule;
});
