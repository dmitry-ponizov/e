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
    stepState.$inject = ['easeCoreFilesProvider', '$stateProvider', 'i18nContent'];
    function stepState(easeCoreFilesProvider, $stateProvider, i18nContent) {
        var provider = this;
        angular.extend(provider, {
            addStepState: function (stepConfig, parentState) {
                var resolve = {
                    stepsGuard: [
                        'stepService',
                        function (stepService) {
                            /* Send the user to AccountSummary if the user is not in the Account Set Up flow */
                            return stepService.stepsRouteGuard();
                        }
                    ],
                    lazyLoadDependencies: [
                        '$ocLazyLoad',
                        '$log',
                        'stepsGuard',
                        function ($ocLazyLoad, $log, stepsGuard) {
                            return $ocLazyLoad.load({
                                name: 'StepModule',
                                files: [easeCoreFilesProvider.get('controller-modal', 'Step'), easeCoreFilesProvider.get('controller', 'Step')]
                            }, function (error) {
                                $log.info('Failed to load Step dependencies: ' + error);
                            });
                        }
                    ],
                    loadComponentDependencies: [
                        'stepService',
                        'stepsGuard',
                        '$stateParams',
                        function (stepService, stepsGuard, $stateParams) {
                            var stepCode = $stateParams.stepCode, accountReferenceId = $stateParams.accountReferenceId;
                            var asuBookendStep = stepService.asuBookendStepList.getStepByStepCodeAndAccountReferenceId(stepCode, accountReferenceId);
                            return asuBookendStep.loadComponentDependencies(function () { return asuBookendStep.next.navigateTo(); });
                        }
                    ],
                    isAsuElementEnabled: [
                        'stepService',
                        '$stateParams',
                        'stepsGuard',
                        function (stepService, $stateParams, stepsGuard) {
                            var stepCode = $stateParams.stepCode, accountReferenceId = $stateParams.accountReferenceId;
                            var asuBookendStep = stepService.asuBookendStepList.getStepByStepCodeAndAccountReferenceId(stepCode, accountReferenceId);
                            return asuBookendStep.isElement();
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
                $stateProvider.state({
                    name: stepConfig.state,
                    url: stepConfig.url + "?accountReferenceId?stepCode",
                    parent: parentState,
                    resolve: resolve,
                    templateProvider: [
                        'stepService',
                        '$stateParams',
                        function (stepService, $stateParams) {
                            var stepCode = $stateParams.stepCode, accountReferenceId = $stateParams.accountReferenceId;
                            var asuBookendStep = stepService.asuBookendStepList.getStepByStepCodeAndAccountReferenceId(stepCode, accountReferenceId);
                            return asuBookendStep
                                .isElement()
                                .then(function (isEnabled) {
                                return isEnabled ? "<" + stepConfig.element.selector + "></" + stepConfig.element.selector + ">" : undefined;
                            })
                                .catch(function () { return undefined; });
                        }
                    ],
                    controller: 'StepController as StepController',
                    title: i18nContent['ease.core.accountsetup.title'],
                    data: {
                        disableDeeplink: true
                    },
                    params: {
                        accountReferenceId: null,
                        stepCode: null
                    }
                });
            },
            initializeStepsStateFromConfig: function (config, parentState) {
                var _this = this;
                Object.keys(config)
                    .map(function (key) {
                    var item = config[key];
                    item.stepCode = key;
                    return item;
                })
                    .filter(function (step) { return step.betweenBookends && step.componentized; })
                    .forEach(function (stepConfig) {
                    _this.addStepState(stepConfig, parentState);
                });
            }
        });
        this.$get = function () {
            return provider;
        };
    }
    angular.module('StepModule', []).provider('StepState', stepState);
});
