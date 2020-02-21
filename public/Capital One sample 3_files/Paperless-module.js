define(["require", "exports", "angular"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    paperlessState.$inject = ['easeCoreFilesProvider'];
    function paperlessState(easeCoreFilesProvider) {
        var provider = this;
        var paperlessState = {};
        function PaperlessState(parentName, stateName) {
            this.setup = {
                name: stateName,
                url: '/account-setup/paperless',
                parent: parentName,
                resolve: {
                    lazyLoadDependencies: [
                        '$ocLazyLoad',
                        '$log',
                        '$injector',
                        function ($ocLazyLoad, $log) {
                            return $ocLazyLoad
                                .load({
                                name: 'paperlessModule',
                                files: [easeCoreFilesProvider.get('controller-modal', 'Paperless'), easeCoreFilesProvider.get('controller', 'Paperless')]
                            }, function (error) {
                                $log.info('Failed to load Paperless dependencies: ' + error);
                            })
                                .then(function () {
                                return;
                            });
                        }
                    ],
                    paperlessData: [
                        '$ocLazyLoad',
                        '$log',
                        '$injector',
                        function ($ocLazyLoad, $log, $injector) {
                            return $ocLazyLoad.load(['js!CreditCard']).then(function () {
                                var CCPaperlessService = $injector.get('CCPaperlessService');
                                return CCPaperlessService.getPaperlessData();
                            }, function (error) {
                                $log.info('Failed to load CreditCard dependencies: ' + error);
                            });
                        }
                    ]
                },
                controller: 'PaperlessCtrl'
            };
        }
        angular.extend(provider, {
            set: function (parentName, stateName) {
                paperlessState = new PaperlessState(parentName, stateName);
            },
            get: function () {
                return paperlessState;
            }
        });
        this.$get = function () {
            return provider;
        };
    }
    angular.module('PaperlessModule', []).provider('PaperlessState', paperlessState);
});
