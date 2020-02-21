'use strict';
define(['angular'], function (angular) {
    angular.module('TransferExternalAccountModule', []).provider('verifyAccountState', providerFn);
    providerFn.$inject = [
        '$stateProvider',
        'easeFilesProvider',
        'easeTemplatesProvider',
        'easeCoreTemplatesProvider',
        'easeCoreFilesProvider'
    ];
    function providerFn($stateProvider, easeFilesProvider, easeTemplatesProvider, easeCoreTemplatesProvider, easeCoreFilesProvider) {
        var _this = this;
        var VERIFY_STATES = ['vfyExtAccount', 'vfyExtAccountSuccess'];
        var ACCOUNT_CHOOSER_STATES = ['accountChooser'];
        var stateDict = {
            vfyExtAccount: {
                files: [
                    easeCoreFilesProvider.get('controller-verify', 'TransferExternalAccount'),
                    easeCoreFilesProvider.get('verify-component', 'TransferExternalAccount'),
                    easeCoreFilesProvider.get('service', 'TransferExternalAccount')
                ],
                controller: 'VerifyExternalAccountCtrl as verifyCtrl',
                templateUrl: easeCoreTemplatesProvider.get('TransferExternalAccount', '', 'verify-index'),
                options: {
                    pageViewObject: { levels: ['verify account'] },
                    params: {
                        account: null
                    }
                }
            },
            vfyExtAccountSuccess: {
                files: [easeFilesProvider.get('controller-success', 'TransferExternalAccount')],
                controller: 'VerifyExternalAccountSuccessCtrl as successCtrl',
                templateUrl: easeTemplatesProvider.get('TransferExternalAccount', '', 'success'),
                options: {
                    pageViewObject: { levels: ['verify account', 'success'] },
                    params: {
                        account: null
                    }
                }
            },
            accountChooser: {
                files: [
                    easeFilesProvider.get('service', 'TransferExternalAccount'),
                    easeFilesProvider.get('controller-account-chooser', 'TransferExternalAccount')
                ],
                controller: 'AccountChooserCtrl as accountChooserCtrl',
                templateUrl: easeTemplatesProvider.get('TransferExternalAccount', '', 'accountChooser'),
                options: {
                    url: '/accountChooser',
                    resolve: {
                        featureToggle: function ($q, $timeout, $state, featureToggleFactory, EaseConstant) {
                            var deferred = $q.defer();
                            featureToggleFactory.initializeFeatureToggleData().then(function (data) {
                                if (!data[EaseConstant.features.externalAccountChooser]) {
                                    $state.go('accountSummary');
                                    deferred.reject();
                                }
                                else {
                                    deferred.resolve();
                                }
                            });
                            return deferred.promise;
                        },
                        account: function (lazyLoad, featureToggle, transferExternalAccountsFactory, $stateParams) {
                            return transferExternalAccountsFactory.getUnconfirmedAccount().then(function (account) {
                                $stateParams.account = account;
                            });
                        }
                    }
                }
            }
        };
        var setStates = function (parent, states) {
            angular.forEach(states, function (state) {
                this.registerState(state, parent);
            }, _this);
        };
        angular.extend(this, {
            setVerifyStates: function (parent) {
                setStates(parent, VERIFY_STATES);
            },
            setAccountChooserStates: function (parent) {
                setStates(parent, ACCOUNT_CHOOSER_STATES);
                setStates(parent, VERIFY_STATES);
            },
            registerState: function (stateName, parent) {
                var stateObject = {
                    resolve: {
                        lazyLoad: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                files: stateDict[stateName].files
                            });
                        }
                    },
                    onEnter: function (easeUIModalService, easeTemplates, $state, featureToggleFactory, EaseConstant, easeExceptionsService, pubsubService, summaryService) {
                        var returnToParent = function () {
                            $state.go(parent.name, {}, {
                                reload: true
                            });
                        };
                        featureToggleFactory.initializeFeatureToggleData().then(function (data) {
                            if (data[EaseConstant.features.verifyTransferExternalAccount]) {
                                var options = {
                                    controller: stateDict[stateName].controller,
                                    templateUrl: stateDict[stateName].templateUrl
                                };
                                easeUIModalService.showModal(options).then(function (modal) {
                                    modal.close.then(function (stateData) {
                                        if (stateData) {
                                            $state.go(stateData.state, stateData.optionalParams);
                                        }
                                        else {
                                            returnToParent();
                                        }
                                    });
                                });
                            }
                            else {
                                easeExceptionsService.throwFeatureUnavailableSnag();
                                returnToParent();
                            }
                            return data;
                        });
                    }
                };
                _.merge(stateObject, stateDict[stateName].options);
                $stateProvider.state(parent.name + '.' + stateName, stateObject);
                return stateObject;
            },
            $get: function () {
                return this;
            }
        });
    }
});
