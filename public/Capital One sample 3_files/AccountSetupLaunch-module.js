define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    accountSetupLaunchState.$inject = ['EaseConstant'];
    function accountSetupLaunchState(EaseConstant) {
        var provider = this;
        var accountSetupLaunchState = {
            name: EaseConstant.states.kAccountSetupLaunch,
            url: EaseConstant.easeURLs.accountSetup,
            resolve: {
                launchASU: [
                    'stepService',
                    'featureToggleFactory',
                    '$state',
                    '$log',
                    '$location',
                    '$stateParams',
                    'pubsubService',
                    'StepsLaunchSourceEnum',
                    function (stepService, featureToggleFactory, $state, $log, $location, $stateParams, pubsubService, StepsLaunchSourceEnum) {
                        featureToggleFactory.initializeFeatureToggleData().then(function (featureToggleData) {
                            var launchSource = $stateParams.source;
                            var stepFlowMode = $stateParams.stepFlowMode;
                            if (launchSource === StepsLaunchSourceEnum.challengeApp) {
                                pubsubService.pubsubTrackAnalytics({ challengeApp: 'post' });
                            }
                            if (featureToggleData[EaseConstant.features.enableSteps]) {
                                var challengeAppSteps = $stateParams.accountRefIds.split(';').map(function (param) {
                                    var paramArray = param.split('-');
                                    return {
                                        accountRefId: paramArray[0],
                                        stepCode: paramArray[1]
                                    };
                                });
                                stepService.initSteps({ stepFlowMode: stepFlowMode, challengeAppSteps: challengeAppSteps, launchSource: launchSource }).then(function () {
                                    var hasCorrectStepsForStepFlowMode = (stepFlowMode === 'widget' && stepService.steps.widget.length) ||
                                        (stepFlowMode === 'ftux' && stepService.steps.ftux.length);
                                    if (hasCorrectStepsForStepFlowMode) {
                                        stepService.startStepsExperience(stepFlowMode);
                                    }
                                    else {
                                        $state.go(EaseConstant.states.kAccountSummary);
                                    }
                                }, function (err) {
                                    $log.log('Error initializing steps after ChallengeApp.', err);
                                    $state.go(EaseConstant.states.kAccountSummary);
                                });
                            }
                            else {
                                $state.go(EaseConstant.states.kAccountSummary);
                            }
                        });
                    }
                ]
            }
        };
        this.set = function (parentState) {
            accountSetupLaunchState.parent = parentState;
        };
        this.get = function () {
            return accountSetupLaunchState;
        };
        this.$get = function () {
            return provider;
        };
    }
    angular.module('AccountSetupLaunchModule', []).provider('AccountSetupLaunchState', accountSetupLaunchState);
});
