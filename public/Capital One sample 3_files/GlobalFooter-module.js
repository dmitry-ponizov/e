define(['angular'], function (angular) {
    'use strict';
    var globalFooterModule = angular.module('GlobalFooterModule', ['easeAppUtils']);
    globalFooterModule.directive('footerSubmenu', [
        '$document',
        function ($document) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var addMyClass = function (classToAdd) {
                        var myClasses = ['footerHover', 'footerClick'];
                        for (var cCl in myClasses) {
                            if (myClasses[cCl] === classToAdd) {
                                element.addClass(classToAdd);
                            }
                            else {
                                element.removeClass(myClasses[cCl]);
                            }
                        }
                    };
                    function togglePopup(onlyIfOpen) {
                        if (element.hasClass('footerClick')) {
                            closePopup();
                        }
                        else {
                            if (!onlyIfOpen) {
                                angular.element($document[0].querySelectorAll('li.has-children')).removeClass('footerClick');
                                addMyClass('footerClick');
                                var el = element.find('ul').children()[0];
                                el.firstChild.focus();
                            }
                        }
                    }
                    function closePopup() {
                        element.removeClass('footerClick');
                    }
                    $document.bind('click', function () {
                        closePopup();
                    });
                    scope.$on('$stateChangeStart', function () {
                        closePopup();
                    });
                    element.bind('click', function (event) {
                        togglePopup();
                        event.stopImmediatePropagation();
                    });
                    element.bind('keyup', function (evt) {
                        if (evt.which === 13 || evt.which === 48) {
                            togglePopup();
                        }
                        else if (evt.which === 27) {
                            togglePopup(true);
                        }
                    });
                }
            };
        }
    ]);
    globalFooterModule.directive('footerAriaLabel', [
        'i18nContent',
        function (i18nContent) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.parent().attr('aria-label', i18nContent['ease.core.footer.aria.label']);
                }
            };
        }
    ]);
    globalFooterModule.controller('GlobalFooterController', [
        '$scope',
        '$rootScope',
        'EaseConstantFactory',
        'appCookie',
        'ContentConstant',
        'EaseConstant',
        'featureToggleFactory',
        'pubsubService',
        '$window',
        'customerPlatformDetailsFactory',
        '$state',
        'languagePreferencesFactory',
        'i18nContent',
        'profilePreferencesFactory',
        'EASEUtilsFactory',
        'usabillaUtils',
        'globalNavigationUtils',
        function ($scope, $rootScope, EaseConstantFactory, appCookie, ContentConstant, EaseConstant, featureToggleFactory, pubsubService, $window, customerPlatformDetailsFactory, $state, languagePreferencesFactory, i18nContent, profilePreferencesFactory, EASEUtilsFactory, usabillaUtils, globalNavigationUtils) {
            var vm = this;
            vm.i18nContent = i18nContent;
            vm.globalNavigationUtils = globalNavigationUtils;
            var countryCode = languagePreferencesFactory
                .getCurrentLocale()
                .slice(-2)
                .toLowerCase();
            if (countryCode === 'us') {
                vm.disclaimer = i18nContent[ContentConstant.kCoreGlobalFooterArticle].article.section.body;
            }
            $rootScope.$on('profileHubExp', function (event, headerfooterExp) {
                vm.navigationBottomBarExperience = headerfooterExp === 'experienceB' || headerfooterExp === 'B' || headerfooterExp === 'C';
            });
            vm.isFeedbackButtonDisplay = false;
            $rootScope.$on('featureToggleReady', function () {
                var featureToggleData = featureToggleFactory.getFeatureToggleData();
                vm.isFooterUpgrade = featureToggleData[EaseConstant.features.enableAngularFooter];
                vm.isFeedbackButtonDisplay = featureToggleData[EaseConstant.features.usabillaFeature];
            });
            $rootScope.$on('customerPlatFormReady', function () {
                var data = customerPlatformDetailsFactory.getCustomerPlatformData();
                if (data && data.customerPlatform) {
                    var platforms = data.customerPlatform.split(',').map(function (item) {
                        return item.trim().toUpperCase();
                    });
                    if (platforms.indexOf('EASEM') > -1) {
                        vm.isFullSiteLink = false;
                    }
                    else if (platforms.indexOf('EASEW') > -1) {
                        vm.isFullSiteLink = true;
                    }
                    else {
                        vm.isFullSiteLink = false;
                    }
                    if (vm.isFullSiteLink) {
                        vm.fullSiteUrl = data.fullsiteUrl;
                    }
                    vm.termsAndCondition =
                        data.customerPlatform.indexOf('EASEM') === -1 &&
                            data.customerPlatform.indexOf('EASEW') === -1 &&
                            data.customerPlatform.indexOf('EASE') > -1
                            ? i18nContent['ease.core.footer.beta.terms.link']
                            : i18nContent['ease.core.footer.terms.link'];
                }
                else {
                    vm.isFullSiteLink = false;
                    vm.termsAndCondition = i18nContent['ease.core.footer.terms.link'];
                }
            });
            vm.house = EaseConstant.easeFooterOptions.house;
            vm.norton = EaseConstant.easeFooterOptions.norton;
            vm.fdic = EaseConstant.easeFooterOptions.fdic;
            angular.extend(vm, {
                displayFooter: function () {
                    return ($state.current.data && $state.current.data.hideFooter) || vm.isFooterUpgrade
                        ? ''
                        : "/ease-ui/dist/features/GlobalFooter/html/GlobalFooter-index_" + countryCode + ".html";
                },
                showNGFooter: function () {
                    return vm.isFooterUpgrade;
                },
                createCookie: function () {
                    pubsubService.pubsubTrackAnalytics({
                        name: 'full site:link'
                    });
                    appCookie.create('easeBetaOptOut', 'true');
                    appCookie.erase(EaseConstant.cookies.kNavigation);
                    appCookie.erase('C1_DEEPLINK');
                },
                currentYear: new Date().getFullYear(),
                openFeedback: function () {
                    usabillaUtils.openFeedback();
                }
            });
        }
    ]);
    return globalFooterModule;
});
