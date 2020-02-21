'use strict';
define(['angular'], function (angular) {
    enoExtensionState.$inject = ['easeCoreFilesProvider'];
    function enoExtensionState(easeCoreFilesProvider) {
        var provider = this;
        var currentLineOfBusiness = null;
        var EnoExtensionStatesArray = {};
        function EnoExtensionState(parentName, stateName) {
            return {
                name: stateName,
                url: '/virtualNumbers',
                parent: parentName,
                resolve: {
                    featureToggleData: [
                        'featureToggleFactory',
                        function (featureToggleFactory) {
                            return featureToggleFactory.initializeFeatureToggleData();
                        }
                    ],
                    enoExtensionDependencies: [
                        '$ocLazyLoad',
                        'featureToggleData',
                        'angularElementsUtils',
                        function ($ocLazyLoad, featureToggleData, angularElementsUtils) {
                            if (!featureToggleData['ease.core.enoextensionmodalangular']) {
                                this.controller = 'EnoExtensionController';
                                this.templateUrl = null;
                                return $ocLazyLoad.load({
                                    name: 'EnoExtensionModule',
                                    serie: true,
                                    files: [
                                        easeCoreFilesProvider.get('service', 'EnoExtension'),
                                        easeCoreFilesProvider.get('controller', 'EnoExtension'),
                                        easeCoreFilesProvider.get('modal-controller', 'EnoExtension'),
                                        easeCoreFilesProvider.get('unavailableModal-controller', 'EnoExtension')
                                    ]
                                });
                            }
                            else {
                                return angularElementsUtils.getAngularElementsDependencies().then(function () {
                                    return angularElementsUtils.getAngularElementsFeature(['ease-web-core-eno-extension']);
                                });
                            }
                        }
                    ],
                    harmonyContent: [
                        'featureToggleData',
                        'enoExtensionDependencies',
                        '$injector',
                        function (featureToggleData, enoExtensionDependencies, $injector) {
                            if (!featureToggleData['ease.core.enoextensionmodalangular']) {
                                var enoExtensionService = $injector.get('enoExtensionService');
                                return enoExtensionService.getHarmonyContent();
                            }
                            else {
                                return '';
                            }
                        }
                    ]
                },
                templateUrl: '/ease-ui/dist/features/EnoExtension/html/EnoExtension-angular-modal.html'
            };
        }
        angular.extend(provider, {
            set: function (parentName, stateName) {
                var enoExtensionState = EnoExtensionState(parentName, stateName);
                currentLineOfBusiness = parentName.name;
                EnoExtensionStatesArray[parentName.name] = enoExtensionState;
            },
            get: function () {
                return EnoExtensionStatesArray[currentLineOfBusiness];
            },
            setCurrentLOB: function (lob) {
                currentLineOfBusiness = lob;
            },
            getCurrentLOB: function () {
                return currentLineOfBusiness;
            }
        });
        this.$get = function () {
            return provider;
        };
    }
    return angular.module('EnoExtensionModule', []).provider('EnoExtensionState', enoExtensionState);
});
