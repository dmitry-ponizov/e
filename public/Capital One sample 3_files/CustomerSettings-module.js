define(['angular'], function (angular) {
    'use strict';
    configFn.$inject = [
        '$stateProvider',
        '$urlRouterProvider',
        'EaseConstant',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider',
        'easeTemplatesProvider',
        'easeFilesProvider',
        'addAccountStateProvider',
        '$urlMatcherFactoryProvider',
        'i18nContent'
    ];
    function configFn($stateProvider, $urlRouterProvider, EaseConstant, easeCoreTemplatesProvider, easeCoreFilesProvider, easeTemplatesProvider, easeFilesProvider, addAccountStateProvider, $urlMatcherFactoryProvider, i18nContent) {
        $urlMatcherFactoryProvider.caseInsensitive(true);
        var customerSettingsState = {
            name: 'customerSettings',
            abstract: true,
            url: '',
            resolve: {
                summaryData: [
                    'summaryService',
                    '$q',
                    function (summaryService, $q) {
                        var deferred = $q.defer();
                        if (!summaryService.getLobArray().length) {
                            summaryService.set().then(function (data) {
                                deferred.resolve(data.accounts);
                            }, function () {
                                deferred.reject([]);
                            });
                        }
                        else {
                            summaryService.get().then(function (data) {
                                deferred.resolve(data.accounts);
                            }, function () {
                                deferred.reject([]);
                            });
                        }
                        return deferred.promise;
                    }
                ],
                customerSettingsDependencies: [
                    '$ocLazyLoad',
                    '$log',
                    '$injector',
                    function ($ocLazyLoad, $log, $injector) {
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: [easeFilesProvider.get('controller', 'CustomerSettings')]
                        })
                            .catch(function (error) {
                            $log.error('Failed to load customerSettingsDependencies: ' + error);
                        });
                    }
                ]
            },
            controller: 'CustomerSettingsController',
            controllerAs: 'customerSettings',
            templateUrl: easeTemplatesProvider.get('CustomerSettings')
        };
        $stateProvider.state(customerSettingsState);
    }
    return angular
        .module('customerSettingsModule', [
        'ui.router',
        'restangular',
        'oc.lazyLoad',
        'ngImgCrop',
        'EaseProperties',
        'easeAppUtils',
        'EaseLocalizeModule',
        'coreUtils'
    ])
        .config(configFn);
});
