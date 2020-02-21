define(['angular'], function (angular) {
    'use strict';
    var storeModule = angular.module('StoreModule', []).factory('Store', function () {
        // Return the instance of @ngrx/store from Angular
        return window.__EASE_SHARED_CONTEXT__.store;
    });
    return storeModule;
});
