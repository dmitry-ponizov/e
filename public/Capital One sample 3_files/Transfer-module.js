define(['angular', 'moment', 'moment-timezone'], function (angular, moment, moment_timezone) {
    'use strict';
    var transferModule = angular.module('TransferModule', [
        'EaseProperties',
        'easeAppUtils',
        'restangular',
        'ngMessages',
        'i18nModule',
        'ngLocale'
    ]);
    transferModule.provider('TransferMoment', function () {
        this.$get = function () {
            var localMoment = angular.copy(moment);
            localMoment.locale('en');
            return localMoment;
        };
    });
    transferModule.provider('transferState', [
        'easeTemplatesProvider',
        'easeFilesProvider',
        'EaseConstant',
        '$stateProvider',
        function (easeTemplatesProvider, easeFilesProvider, EaseConstant, $stateProvider) {
            var provider = this;
            var currentLineOfBusiness = null;
            var transferMoneyStatesArray = {};
            function TransferMoneyStatesModel(parentName, startName, successName, cancelName, cancelConfirmName, errorName, editName, url) {
                this.transferStart = {
                    name: startName,
                    url: !url ? EaseConstant.easeURLs.transfer : url,
                    params: {
                        data: ''
                    },
                    parent: parentName,
                    resolve: {
                        transferService: function ($ocLazyLoad, $injector) {
                            return $ocLazyLoad
                                .load({
                                serie: true,
                                files: [
                                    easeFilesProvider.get('constants', 'Transfer'),
                                    easeFilesProvider.get('services', 'Transfer'),
                                    easeFilesProvider.get('filters', 'Transfer'),
                                    easeFilesProvider.get('controller-common', 'Transfer'),
                                    easeFilesProvider.get('controller-index', 'Transfer'),
                                    easeFilesProvider.get('controller-success', 'Transfer'),
                                    easeFilesProvider.get('controller-error', 'Transfer'),
                                    easeFilesProvider.get('controller-unavailable', 'Transfer'),
                                    easeFilesProvider.get('directives', 'Transfer')
                                ]
                            })
                                .then(function () {
                                return $injector.get('TransferFactory');
                            });
                        },
                        transactionAsyncData: function (transferService, $stateParams, featureToggleFactory, EaseConstant, languagePreferencesFactory, $q) {
                            var item = {
                                category: $stateParams.category,
                                accountRefId: $stateParams.data
                                    ? $stateParams.data.referenceId
                                    : $stateParams.referenceId
                                        ? $stateParams.referenceId
                                        : $stateParams.accountReferenceId
                            };
                            transferService.setAccItem(item);
                            if (!/transferScheduleUnavailable/.test($stateParams.data.previousStateName)) {
                                var promises = {
                                    info: transferService.getTransferInfo()
                                };
                                var deferred_1 = $q.defer();
                                $q.all(promises).then(function (data) {
                                    if (data.info.isDisplayData) {
                                        deferred_1.resolve(data.info);
                                    }
                                    else {
                                        deferred_1.reject(data);
                                    }
                                });
                                return deferred_1.promise;
                            }
                        }
                    },
                    onEnter: function ($state, featureToggleFactory, EaseConstant, i18nContent) {
                        var featureToggleDataPromise = featureToggleFactory.initializeFeatureToggleData();
                        featureToggleDataPromise.then(function (featureToggleData) {
                            if (featureToggleData && featureToggleData[EaseConstant.features.transferFeatureName] === false) {
                                $state.go(errorName, {
                                    featureUnavailableMsg: i18nContent['ease.core.transfer.snag.error.unavailable']
                                });
                            }
                        });
                    },
                    controller: 'TransferIndexCtrl'
                };
                this.transferSuccess = {
                    params: {
                        transfer: ''
                    },
                    name: successName,
                    url: '',
                    parent: parentName,
                    controller: 'TransferSuccessCtrl',
                    resolve: {
                        transferStatusdata: [
                            '$stateParams',
                            function ($stateParams) {
                                return $stateParams;
                            }
                        ]
                    }
                };
                this.transferEdit = {
                    name: editName,
                    url: EaseConstant.easeURLs.editTransfer,
                    parent: parentName,
                    resolve: {
                        transferService: function ($ocLazyLoad, $injector) {
                            return $ocLazyLoad
                                .load({
                                name: 'TransferModule',
                                files: [easeFilesProvider.get('constants', 'Transfer'), easeFilesProvider.get('services', 'Transfer')]
                            })
                                .then(function () {
                                return $injector.get('TransferFactory');
                            });
                        },
                        transfersDependencies: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'TransferModule',
                                files: [
                                    easeFilesProvider.get('controller-common', 'Transfer'),
                                    easeFilesProvider.get('controller-success', 'Transfer'),
                                    easeFilesProvider.get('controller-edit', 'Transfer'),
                                    easeFilesProvider.get('controller-error', 'Transfer'),
                                    easeFilesProvider.get('controller-unavailable', 'Transfer'),
                                    easeFilesProvider.get('directives', 'Transfer'),
                                    easeFilesProvider.get('filters', 'Transfer')
                                ]
                            });
                        },
                        transactionAsyncData: function ($injector, $stateParams, featureToggleFactory, EaseConstant, languagePreferencesFactory, transferService, $q, $state, TransferConstant, i18nContent) {
                            if (_.isEmpty(transferService.getEditTransferData())) {
                                var moneyTransferReferenceId = $stateParams.moneyTransferReferenceId;
                                var deferred_2 = $q.defer();
                                var promises = {
                                    info: transferService.getManagedTransferInfo(moneyTransferReferenceId, TransferConstant.kTransferBusEventId.editBusEventId)
                                };
                                $q.all(promises).then(function (data) {
                                    if (data.info.isDisplayData) {
                                        var transfer = data.info;
                                        if (transfer.isEditableIndicator) {
                                            transferService.setEditTransferData(transfer);
                                            deferred_2.resolve(data.info);
                                        }
                                        else {
                                            $state.go(errorName, {
                                                featureUnavailableMsg: i18nContent['ease.core.transfer.snag.error.uneditable']
                                            });
                                            deferred_2.reject(data);
                                        }
                                    }
                                });
                                return deferred_2.promise;
                            }
                        }
                    },
                    controller: 'TransferEditCtrl'
                };
                this.transferCancel = {
                    name: cancelName,
                    url: EaseConstant.easeURLs.cancelTransfer,
                    parent: parentName,
                    params: {
                        data: null
                    },
                    controller: 'TransferCancelCtrl',
                    resolve: {
                        transferService: function ($ocLazyLoad, $injector) {
                            return $ocLazyLoad
                                .load({
                                name: 'TransferModule',
                                files: [easeFilesProvider.get('constants', 'Transfer'), easeFilesProvider.get('services', 'Transfer')]
                            })
                                .then(function () {
                                return $injector.get('TransferFactory');
                            });
                        },
                        transfersDependencies: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'TransferModule',
                                files: [
                                    easeFilesProvider.get('controller-cancel', 'Transfer'),
                                    easeFilesProvider.get('controller-cancel-confirm', 'Transfer'),
                                    easeFilesProvider.get('controller-error', 'Transfer'),
                                    easeFilesProvider.get('controller-unavailable', 'Transfer'),
                                    easeFilesProvider.get('directives', 'Transfer'),
                                    easeFilesProvider.get('filters', 'Transfer')
                                ]
                            });
                        },
                        transactionAsyncData: function ($injector, $stateParams, featureToggleFactory, transferService, $q, $state, TransferConstant, i18nContent) {
                            if (_.isEmpty(transferService.getEditTransferData())) {
                                var moneyTransferReferenceId = $stateParams.moneyTransferReferenceId;
                                var deferred_3 = $q.defer();
                                var promises = {
                                    info: transferService.getManagedTransferInfo(moneyTransferReferenceId, TransferConstant.kTransferBusEventId.cancelBusEventId)
                                };
                                $q.all(promises).then(function (data) {
                                    if (data.info.isDisplayData) {
                                        var transfer = data.info;
                                        if (transfer.isCancelableIndicator) {
                                            transferService.setEditTransferData(transfer);
                                            deferred_3.resolve(transfer);
                                        }
                                        else {
                                            $state.go(errorName, {
                                                featureUnavailableMsg: i18nContent['ease.core.transfer.snag.error.uncancelable']
                                            });
                                        }
                                    }
                                    else {
                                        deferred_3.reject(data);
                                    }
                                });
                                return deferred_3.promise;
                            }
                        }
                    }
                };
                this.transferCancelConfirm = {
                    name: cancelConfirmName,
                    url: '',
                    parent: parentName,
                    params: {
                        data: null
                    },
                    controller: 'TransferCancelConfirmCtrl'
                };
                this.transferError = {
                    params: {
                        featureUnavailableMsg: ''
                    },
                    name: errorName,
                    url: '',
                    parent: parentName,
                    controller: 'TransferErrorCtrl'
                };
            }
            angular.extend(provider, {
                set: function (parentName, startName, successName, cancelName, cancelConfirmName, errorName, editName, url) {
                    var newTransferMoneyState = new TransferMoneyStatesModel(parentName, startName, successName, cancelName, cancelConfirmName, errorName, editName, url);
                    currentLineOfBusiness = parentName.name;
                    transferMoneyStatesArray[parentName.name] = newTransferMoneyState;
                    var transferScheduleUnavailable = {
                        params: {
                            data: null
                        },
                        name: this.getCurrentLOB() + '.' + EaseConstant.stateNames.transferScheduleUnavailable,
                        parent: this.getCurrentLOB(),
                        url: '',
                        controller: 'TransferScheduleUnavailableCtrl'
                    };
                    this.addTransferState(transferScheduleUnavailable);
                },
                get: function () {
                    return transferMoneyStatesArray[currentLineOfBusiness];
                },
                setCurrentLOB: function (lob) {
                    currentLineOfBusiness = lob;
                },
                getCurrentLOB: function () {
                    return currentLineOfBusiness;
                },
                addTransferState: function (state) {
                    $stateProvider.state(state);
                }
            });
            this.$get = function () {
                return provider;
            };
        }
    ]);
    return transferModule;
});
