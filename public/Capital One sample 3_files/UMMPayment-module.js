define(['angular'], function (angular) {
    'use strict';
    var UMMPaymentModule = angular.module('UMMPaymentModule', [
        'EaseProperties',
        'EaseLocalizeModule',
        'easeAppUtils',
        'restangular',
        'pubsubServiceModule',
        'OtpModule'
    ]);
    UMMPaymentModule.provider('paymentState', ["$stateProvider", "$urlRouterProvider", "$locationProvider", "easeFilesProvider", "EaseConstant", function ($stateProvider, $urlRouterProvider, $locationProvider, easeFilesProvider, EaseConstant) {
        var provider = this;
        var dependencies = ['js!CreditCard'];
        function registerPayment(stateName, parentState, url) {
            $stateProvider.state(stateName, {
                params: {
                    payment: ''
                },
                url: !url ? EaseConstant.easeURLs.payment : url,
                parent: parentState,
                resolve: {
                    accountSummaryInfo: [
                        'summaryService',
                        function (summaryService) {
                            return summaryService.get();
                        }
                    ],
                    loadFeatureToggles: [
                        '$ocLazyLoad',
                        '$injector',
                        '$q',
                        'getPaymentCategoryId',
                        function ($ocLazyLoad, $injector, $q, getPaymentCategoryId) {
                            if (getPaymentCategoryId === 'CC') {
                                return $ocLazyLoad
                                    .load({
                                    serie: true,
                                    files: dependencies
                                })
                                    .then(function () {
                                    var defer = $q.defer();
                                    var data = $injector.get('AngularDataService');
                                    var cc = $injector.get('CC');
                                    data.listenToStoreFeatureTogglesData(defer);
                                    cc.loadPaymentFeatureToggles();
                                    return defer.promise;
                                });
                            }
                        }
                    ],
                    loadCardPaymentsSharedBundle: [
                        'loadFeatureToggles',
                        'angularElementsUtils',
                        'getPaymentCategoryId',
                        function (featureToggles, angularElementsUtils, getPaymentCategoryId) {
                            if (getPaymentCategoryId === 'CC') {
                                if (featureToggles && featureToggles.paymentOptionComponent) {
                                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                                        return angularElementsUtils.getAngularElementsFeature(['ease-web-card-payments-shared']);
                                    });
                                }
                            }
                        }
                    ],
                    getPaymentCategoryId: [
                        '$stateParams',
                        'accountSummaryInfo',
                        function ($stateParams, accountSummaryInfo) {
                            var categoryId;
                            if ($stateParams.payment && $stateParams.payment.lineOfBusiness) {
                                categoryId = $stateParams.payment.lineOfBusiness;
                            }
                            else {
                                accountSummaryInfo.accounts.forEach(function (account) {
                                    if (account.referenceId === $stateParams.accountReferenceId) {
                                        categoryId = account.category;
                                    }
                                });
                            }
                            return categoryId;
                        }
                    ],
                    ummPaymentService: [
                        '$ocLazyLoad',
                        '$injector',
                        '$stateParams',
                        'getPaymentCategoryId',
                        function ($ocLazyLoad, $injector, $stateParams, getPaymentCategoryId) {
                            return $ocLazyLoad
                                .load({
                                name: 'UMMPaymentModule',
                                files: [easeFilesProvider.get('services', 'UMMPayment')]
                            })
                                .then(function () {
                                var ummPaymentFactory = $injector.get('UmmPaymentFactory');
                                var modalDetails = {
                                    category: getPaymentCategoryId,
                                    accountRefId: $stateParams.accountReferenceId
                                };
                                ummPaymentFactory.getUmmPaymentModal(modalDetails, $stateParams);
                                return ummPaymentFactory;
                            });
                        }
                    ]
                }
            });
        }
        angular.extend(provider, {
            set: function (stateName, parentNameState, url) {
                registerPayment(stateName, parentNameState, url);
            }
        });
        this.$get = function () {
            return provider;
        };
    }]);
    return UMMPaymentModule;
});
