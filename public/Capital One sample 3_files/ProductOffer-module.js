define(["require", "exports", "angular"], function (require, exports, angular) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        var dependencies = ['js!CreditCard'];
        $stateProvider.state({
            name: 'accountSummary.productOffer',
            url: '/productOffer/{productId:string}/{reservationNumber:string}/{offerExpirationDate:string}',
            resolve: {
                loadDependencies: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: dependencies
                        });
                    }
                ]
            },
            onEnter: [
                '$stateParams',
                'ProductOfferService',
                function (_$stateParams, _productOfferService) {
                    _productOfferService.launchMulticardProductOffer(_$stateParams.productId, _$stateParams.reservationNumber, _$stateParams.offerExpirationDate);
                }
            ]
        });
        $stateProvider.state({
            name: 'accountSummary.directToDynamicApp',
            url: '/productOffer/{productId:string}/{reservationNumber:string}',
            resolve: {
                loadDependencies: [
                    '$ocLazyLoad',
                    '$q',
                    '$injector',
                    function ($ocLazyLoad, $q, $injector) {
                        return $ocLazyLoad
                            .load({
                            serie: true,
                            files: dependencies
                        })
                            .then(function () {
                            var notifyingService = $injector.get('NotifyingService');
                            var cardAccountsCacheRefreshService = $injector.get('CardAccountsCacheRefreshService');
                            notifyingService.bustCoreOLCache();
                            cardAccountsCacheRefreshService.refreshCardAccounts();
                        });
                    }
                ]
            },
            onEnter: [
                '$stateParams',
                '$window',
                'EaseConstant',
                function (_$stateParams, _$window, _easeConstant) {
                    _$window.location.href = _easeConstant['dynamicAppUrl'] + "/?productId=" + _$stateParams.productId + "&marketingChannel=EASEWEB&reservationNumber=" + _$stateParams.reservationNumber;
                }
            ]
        });
        $stateProvider.state({
            name: 'accountSummary.cardProductOffer',
            url: '/productOffer/{brand:string}/{productId:string}/{reservationNumber:string}/{offerExpirationDate:string}',
            templateProvider: [
                '$stateParams',
                function (_$stateParams) {
                    return "<c1-element-card-product-offer-entry\n          brand=" + _$stateParams.brand + " \n          product-id=" + _$stateParams.productId + "\n          reservation-number=" + _$stateParams.reservationNumber + "\n          offer-expiration-date=" + _$stateParams.offerExpirationDate + "></c1-element-card-product-offer-entry>";
                }
            ],
            resolve: {
                loadDependencies: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: dependencies
                        });
                    }
                ]
            },
            onEnter: [
                '$stateParams',
                'angularElementsUtils',
                function (_$stateParams, angularElementsUtils) {
                    return angularElementsUtils.getAngularElementsDependencies().then(function () {
                        return angularElementsUtils.getAngularElementsFeature(['ease-web-card-product-offer']);
                    });
                }
            ]
        });
    }
    angular.module('ProductOfferModule', []).config(config);
});
