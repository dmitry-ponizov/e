'use strict';
define(['angular'], function (angular) {
    enoState.$inject = ['easeCoreTemplatesProvider', 'easeCoreFilesProvider'];
    function enoState(easeCoreTemplatesProvider, easeCoreFilesProvider) {
        var provider = this;
        var currentLineOfBusiness = null;
        var EnoStatesArray = {};
        function EnoState(parentName, stateName) {
            this.eno = {
                name: stateName,
                url: '/eno',
                template: '<c1-element-eno-enrollment></c1-element-eno-enrollment>',
                parent: parentName,
                resolve: {
                    EnoFactory: [
                        '$ocLazyLoad',
                        '$injector',
                        '$log',
                        function ($ocLazyLoad, $injector, $log) {
                            return $ocLazyLoad
                                .load({
                                name: 'EnoModule',
                                serie: true,
                                files: [
                                    easeCoreFilesProvider.get('services', 'Eno'),
                                    easeCoreFilesProvider.get('services', ['CustomerSettings', 'PersonalInformation']),
                                    easeCoreFilesProvider.get('controller', 'Eno')
                                ]
                            })
                                .then(function () {
                                return $injector.get('EnoFactory');
                            }, function (error) {
                                $log.error('Failed to load Eno dependencies: ' + error);
                            });
                        }
                    ],
                    featureToggleData: [
                        'featureToggleFactory',
                        function (featureToggleFactory) {
                            return featureToggleFactory.initializeFeatureToggleData();
                        }
                    ],
                    urlChecking: [
                        'featureToggleData',
                        '$rootScope',
                        'EaseConstant',
                        '$location',
                        '$q',
                        'i18nContent',
                        'ContentConstant',
                        function (featureToggleData, $rootScope, EaseConstant, $location, $q, i18nContent, ContentConstant) {
                            var isOn = featureToggleData[EaseConstant.features.enableENO];
                            var error = {};
                            var deferred = $q.defer();
                            if (!isOn) {
                                error.msgHeader = i18nContent[ContentConstant.kSnagModalHeader];
                                error.msgBody = i18nContent[ContentConstant.kSnagFeatureOffLabel];
                                error.msgButton = i18nContent[ContentConstant.kSnagFeatureOffButtonLabel];
                                $rootScope.$broadcast('error', error);
                                $location.path('/accountSummary');
                                deferred.reject(false);
                            }
                            else {
                                deferred.resolve(true);
                            }
                            return deferred.promise;
                        }
                    ],
                    phoneData: [
                        'EnoFactory',
                        '$q',
                        function (EnoFactory, $q) {
                            var deferred = $q.defer();
                            EnoFactory.getPhoneData().then(function (data) {
                                deferred.resolve(data);
                            });
                            return deferred.promise;
                        }
                    ],
                    enoEnrollmentNGEntrypoint: [
                        'featureToggleData',
                        'angularElementsUtils',
                        '$q',
                        'EaseConstant',
                        function (featureToggleData, angularElementsUtils, $q, EaseConstant) {
                            if (featureToggleData[EaseConstant.features.enableAngularEnoEnrollment]) {
                                return angularElementsUtils
                                    .getAngularElementsDependencies()
                                    .then(function () {
                                    return angularElementsUtils.getAngularElementsFeature(['ease-web-core-eno-enrollment']).then(function (response) {
                                        return !!response;
                                    });
                                })
                                    .catch(function () {
                                    return false;
                                });
                            }
                            return $q.when(false);
                        }
                    ],
                    enoData: [
                        'EnoFactory',
                        '$q',
                        'enoEnrollmentNGEntrypoint',
                        function (EnoFactory, $q, enoEnrollmentNGEntrypoint) {
                            var deferred = $q.defer();
                            if (enoEnrollmentNGEntrypoint) {
                                deferred.resolve({});
                            }
                            else {
                                EnoFactory.getEnoData().then(function (data) {
                                    deferred.resolve(data);
                                });
                            }
                            return deferred.promise;
                        }
                    ]
                },
                controller: 'EnoController'
            };
        }
        angular.extend(provider, {
            set: function (parentName, stateName) {
                var newEnoState = new EnoState(parentName, stateName);
                currentLineOfBusiness = parentName.name;
                EnoStatesArray[parentName.name] = newEnoState;
            },
            get: function () {
                return EnoStatesArray[currentLineOfBusiness];
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
    return angular.module('EnoModule', []).provider('EnoState', enoState);
});
