define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    documentCenterState.$inject = [
        'easeCoreFilesProvider',
        'easeCoreTemplatesProvider',
        'EaseConstant',
        'i18nContent',
        '$stateProvider',
        'angularDynamicRouteProvider'
    ];
    function documentCenterState(easeCoreFilesProvider, easeCoreTemplatesProvider, EaseConstant, i18nContent, $stateProvider, angularDynamiceStateProvider) {
        var provider = this;
        var documentCenterState = {};
        function DocumentCenterState() {
            this.setup = angularDynamiceStateProvider.createState({
                name: EaseConstant.states.kDocumentCenter,
                url: EaseConstant.easeURLs.documentCenter,
                title: i18nContent['ease.core.documentcenter.title'],
                angularFeatureToggles: [EaseConstant.features.enableDocumentCenterAngularPage],
                controllerAs: 'vm',
                angularJsState: {
                    pageViewObject: { levels: [EaseConstant.pubsub.documentCenter.list] },
                    controller: 'DocumentCenterCtrl',
                    templateUrl: easeCoreTemplatesProvider.get('DocumentCenter'),
                    resolve: {
                        summaryData: ['summaryService', summaryDataResolve],
                        displayYears: ['EaseConstant', displayYearsResolve],
                        featureToggleData: ['featureToggleFactory', featureToggleDataResolve],
                        lazyLoadDependencies: [
                            '$ocLazyLoad',
                            '$log',
                            'featureToggleData',
                            'angularElementsUtils',
                            function ($ocLazyLoad, $log, featureToggleData, angularElementsUtils) {
                                $stateProvider;
                                if (featureToggleData[EaseConstant.features.enableDocumentCenterAngularPage]) {
                                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                                        return angularElementsUtils.getAngularElementsFeature(['ease-web-core-document-center']).then(function (response) {
                                            if (!!!response) {
                                                $log.error('Could not load document center element, maybe missing in manifest?');
                                            }
                                        }, function (error) {
                                            $log.error(error);
                                        });
                                    });
                                }
                                else {
                                    return $ocLazyLoad.load({
                                        name: 'DocumentCenterModule',
                                        serie: true,
                                        files: [
                                            easeCoreFilesProvider.get('module', 'Statement'),
                                            easeCoreFilesProvider.get('service', 'Statement'),
                                            easeCoreFilesProvider.get('directive', 'Statement'),
                                            easeCoreFilesProvider.get('services', 'DocumentCenter'),
                                            easeCoreFilesProvider.get('controller', 'DocumentCenter'),
                                            easeCoreFilesProvider.get('controller-pdfViewer', 'DocumentCenter')
                                        ]
                                    }, function (error) {
                                        $log.info('Failed to load DocumentCenter dependencies: ' + error);
                                    });
                                }
                            }
                        ]
                    }
                },
                angularState: {
                    templateUrl: '/ease-ui/dist/features/DocumentCenter/html/DocumentCenter-angular.html',
                    resolve: {
                        angularResolve_summaryData: ['summaryService', summaryDataResolve],
                        angularResolve_displayYears: ['EaseConstant', displayYearsResolve],
                        angularResolve_featureToggleData: ['featureToggleFactory', featureToggleDataResolve],
                        angularResolve_lazyLoadDependencies: [
                            '$ocLazyLoad',
                            '$log',
                            'angularResolve_featureToggleData',
                            'angularElementsUtils',
                            function ($ocLazyLoad, $log, featureToggleData, angularElementsUtils) {
                                $stateProvider;
                                if (featureToggleData[EaseConstant.features.enableDocumentCenterAngularPage]) {
                                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                                        return angularElementsUtils.getAngularElementsFeature(['ease-web-core-document-center']).then(function (response) {
                                            if (!!!response) {
                                                $log.error('Could not load document center element, maybe missing in manifest?');
                                            }
                                        }, function (error) {
                                            $log.error(error);
                                        });
                                    });
                                }
                                else {
                                    return $ocLazyLoad.load({
                                        name: 'DocumentCenterModule',
                                        serie: true,
                                        files: [
                                            easeCoreFilesProvider.get('module', 'Statement'),
                                            easeCoreFilesProvider.get('service', 'Statement'),
                                            easeCoreFilesProvider.get('directive', 'Statement'),
                                            easeCoreFilesProvider.get('services', 'DocumentCenter'),
                                            easeCoreFilesProvider.get('controller', 'DocumentCenter'),
                                            easeCoreFilesProvider.get('controller-pdfViewer', 'DocumentCenter')
                                        ]
                                    }, function (error) {
                                        $log.info('Failed to load DocumentCenter dependencies: ' + error);
                                    });
                                }
                            }
                        ]
                    }
                }
            });
            this.showDoc = {
                name: EaseConstant.states.kDocumentCenterShowDocument,
                url: EaseConstant.easeURLs.documentCenterShowDocument,
                pageViewObject: { levels: [EaseConstant.pubsub.documentCenter.list, EaseConstant.pubsub.documentCenter.show] },
                resolve: {
                    featureToggleData: [
                        'featureToggleFactory',
                        'EaseConstant',
                        '$q',
                        '$state',
                        '$timeout',
                        function (featureToggleFactory, EaseConstant, $q, $state, $timeout) {
                            return featureToggleFactory.initializeFeatureToggleData().then(function (data) {
                                if (data) {
                                    return data;
                                }
                                $timeout(function () {
                                    $state.go(EaseConstant.states.kDocumentCenter);
                                }, 0);
                                return $q.reject();
                            });
                        }
                    ]
                },
                onEnter: [
                    'easeUIModalService',
                    'EaseConstant',
                    '$state',
                    'easeExceptionsService',
                    function (easeUIModalService, EaseConstant, $state, easeExceptionsService) {
                        return easeUIModalService
                            .showModal({
                            templateUrl: '/ease-ui/dist/features/DocumentCenter/html/document-pdfViewer.html',
                            controller: 'DocumentViewerModalController as vm'
                        })
                            .then(function (modal) {
                            modal.close.then(function (result) {
                                var isError = result && /error/i.test(result);
                                if (!result || isError) {
                                    if (isError) {
                                        easeExceptionsService.snag({});
                                    }
                                    $state.go(EaseConstant.states.kDocumentCenter);
                                }
                            });
                        });
                    }
                ]
            };
        }
        angular.extend(provider, {
            set: function () {
                documentCenterState = new DocumentCenterState();
            },
            get: function () {
                return documentCenterState;
            }
        });
        this.$get = function () {
            return provider;
        };
    }
    var summaryDataResolve = function (summaryService) {
        var lobs = summaryService.getLobArray();
        if (!angular.isArray(lobs) || !lobs.length) {
            return summaryService
                .set()
                .then(function (data) { return data.accounts; })
                .catch(function () { return []; });
        }
        return summaryService
            .get()
            .then(function (data) { return data.accounts; })
            .catch(function () { return []; });
    };
    var displayYearsResolve = function (EaseConstant) {
        var curYear = new Date(Date.now()).getFullYear();
        var firstYear = EaseConstant.documentCenter.firstYear;
        var retArr = [];
        for (var i = curYear; i >= firstYear; i--) {
            retArr.push(i.toString());
        }
        return retArr;
    };
    var featureToggleDataResolve = function (featureToggleFactory) {
        return featureToggleFactory.initializeFeatureToggleData().then(function (data) {
            return data;
        });
    };
    angular
        .module('DocumentCenterModule', ['easeAppUtils', 'EaseProperties', 'i18nModule', 'pubsubServiceModule'])
        .provider('DocumentCenterState', documentCenterState);
});
