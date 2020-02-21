define(['angular'], function (angular) {
    'use strict';
    var AtmFinderModule = angular.module('AtmFinderModule', [
        'ui.router',
        'restangular',
        'oc.lazyLoad',
        'EaseProperties',
        'ContentProperties',
        'easeAppUtils',
        'angular-lo-dash',
        'coreUtils',
        'i18nModule'
    ]);
    AtmFinderModule.provider('AtmState', [
        'easeTemplatesProvider',
        'easeCoreFilesProvider',
        function (easeTemplatesProvider, easeCoreFilesProvider) {
            var provider = this;
            var currentLineOfBusiness = null;
            var AtmStatesArray = {};
            function AtmStatesModel(parentName, stateName) {
                this.atmFinder = {
                    name: stateName,
                    url: '/AtmFinder',
                    parent: parentName,
                    pageViewObject: { levels: ['atmfinder'] },
                    resolve: {
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
                            function (featureToggleData, $rootScope, EaseConstant, $location, $q, i18nContent) {
                                var isOn = featureToggleData[EaseConstant.features.enableATMFinder];
                                var error = {};
                                var deferred = $q.defer();
                                if (!isOn) {
                                    error.msgHeader = i18nContent['core.common.snag.modal.header'];
                                    error.msgBody = i18nContent['core.common.snag.modal.featureoff.label'];
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
                        AtmFinderFactory: [
                            '$ocLazyLoad',
                            '$injector',
                            'urlChecking',
                            '$log',
                            function ($ocLazyLoad, $injector, urlChecking, $log) {
                                return $ocLazyLoad
                                    .load({
                                    name: 'AtmFinderModule',
                                    serie: true,
                                    files: [
                                        easeCoreFilesProvider.get('constants', 'AtmFinder'),
                                        easeCoreFilesProvider.get('services', 'AtmFinder'),
                                        easeCoreFilesProvider.get('controller', 'AtmFinder'),
                                        easeCoreFilesProvider.get('directives', 'AtmFinder')
                                    ]
                                })
                                    .then(function () {
                                    return $injector.get('AtmFinderFactory');
                                }, function (error) {
                                    $log.error('Failed to load AtmFinder dependencies: ' + error);
                                });
                            }
                        ],
                        AtmFinderLocationData: [
                            'AtmFinderFactory',
                            function (AtmFinderFactory) {
                                return AtmFinderFactory.getAtmData();
                            }
                        ]
                    },
                    controller: 'AtmFinderController'
                };
            }
            angular.extend(provider, {
                set: function (parentName, stateName) {
                    var newAtmState = new AtmStatesModel(parentName, stateName);
                    currentLineOfBusiness = parentName.name;
                    AtmStatesArray[parentName.name] = newAtmState;
                },
                get: function () {
                    return AtmStatesArray[currentLineOfBusiness];
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
    ]);
    AtmFinderModule.filter('locationType', function () {
        return function (allLocations, typesToReturn) {
            if (typesToReturn.length) {
                return allLocations.filter(function (location) {
                    return !location.locationType || typesToReturn.indexOf(location.locationType) > -1;
                });
            }
            return allLocations;
        };
    });
    return AtmFinderModule;
});
