define(["angular"],function(e){"use strict";function n(e,n,r,a,t,o){function i(){function e(e){o.resolve(e.data)}function t(){o.resolve([{label:"header.language.english",value:"en_US"}])}var o=n.defer();return r.get(a.baseUrl+"/languages").then(e,t),o.promise}function g(){t.$on("$translatePartialLoaderStructureChanged",function(){o.refresh()})}function l(){t.$on("$translateMissingTranslationError",function(n,r){throw e.createEaseException({module:"LanguageToggleModule","function":"languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent",cause:"failed to find translation for "+r})})}function u(){t.$on("$translateLoadingError",function(n,r){throw e.createEaseException({module:"LanguageToggleModule","function":"languageToggleService.registerThrowErrorOnTranslateLoadFailure",cause:"failed to load partial for lang "+r.language})})}return{getLanguages:i,registerRefreshOnTranslateAddPartEvent:g,registerThrowErrorOnMissingTranslationErrorEvent:l,registerThrowErrorOnTranslateLoadFailureEvent:u}}function r(e,n,r){function a(n,r){e.create(t,r)}function o(){return e.read(t)}return{put:a,get:o}}function a(e){function n(n){return e.$emit("$translateMissingTranslationError",n),n}return n}var t="locale_pref";e.module("LanguageToggleModule").factory("languageToggleService",["easeExceptionsService","$q","$http","EaseConstant","$rootScope","$translate",n]).factory("languageToggleStorage",["appCookie","$http","EaseConstant",r]).factory("languageToggleMissingTranslationHandler",["$rootScope",a])});