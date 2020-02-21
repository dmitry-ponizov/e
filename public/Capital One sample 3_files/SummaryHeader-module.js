define(['angular'], function (angular) {
    'use strict';
    angular
        .module('SummaryHeaderModule', ['ngAria', 'ngAnimate', 'ui.router', 'ContentProperties', 'easeAppUtils'])
        .directive('slideToggle', [
        'pubsubService',
        '$document',
        '$timeout',
        'EaseConstant',
        function (pubsubService, $document, $timeout, EaseConstant) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var content;
                    scope.anchorNodes = [];
                    var moveFocusItem = function (way) {
                        if (way === 'up') {
                            scope.itemIdxFocus -= 1;
                        }
                        else if (way === 'down') {
                            scope.itemIdxFocus += 1;
                        }
                        if (scope.itemIdxFocus < 0) {
                            scope.itemIdxFocus = scope.anchorNodes.length - 1;
                        }
                        else if (scope.itemIdxFocus >= scope.anchorNodes.length) {
                            scope.itemIdxFocus = 0;
                        }
                        scope.anchorNodes[scope.itemIdxFocus].focus();
                    };
                    var addAccessibiityMenu = function (toggle, menuNode) {
                        var nameDrop = angular.element(document.getElementById('name_drop'));
                        if (scope.anchorNodes.length === 0) {
                            scope.anchorNodes = nameDrop.find('a');
                        }
                        scope.itemIdxFocus = 0;
                        if (toggle) {
                            nameDrop.on('keydown', function (evt) {
                                var keyCode = evt.which || evt.keyCode || evt.charCode;
                                if (keyCode === EaseConstant.keyCodes.ENTER) {
                                    evt.target.click();
                                }
                                else {
                                    if (keyCode === EaseConstant.keyCodes.ESCAPE || keyCode === EaseConstant.keyCodes.TAB) {
                                        showHideMenu();
                                    }
                                    else if (keyCode === EaseConstant.keyCodes.UP_ARROW) {
                                        moveFocusItem('up');
                                    }
                                    else if (keyCode === EaseConstant.keyCodes.DOWN_ARROW) {
                                        moveFocusItem('down');
                                    }
                                    else {
                                        return true;
                                    }
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    return false;
                                }
                            });
                        }
                        else {
                            nameDrop.off('keydown');
                        }
                    };
                    var showHideMenu = function () {
                        var target = document.querySelector(attrs.slideToggle);
                        if (!content) {
                            content = target.querySelector('.slideable_content');
                        }
                        var menuNode = angular.element(target);
                        var profileLink = angular.element(document.getElementById('profileLink'));
                        if (menuNode.hasClass('slideup')) {
                            menuNode.removeClass('slideup');
                            element.attr('aria-expanded', 'true');
                            menuNode.addClass('slidedown');
                            profileLink.addClass('clicked');
                            addAccessibiityMenu(true, menuNode);
                            scope.anchorNodes[scope.itemIdxFocus].focus();
                        }
                        else {
                            menuNode.removeClass('slidedown');
                            element.attr('aria-expanded', 'false');
                            menuNode.addClass('slideup');
                            profileLink.removeClass('clicked');
                            addAccessibiityMenu(false, menuNode);
                            element[0].focus();
                        }
                        scope.$apply();
                    };
                    attrs.expanded = false;
                    var headerNavEl = angular.element(element[0].parentNode);
                    headerNavEl.bind('keydown', function (evt) {
                        var navItemID = evt.target.id;
                        if (navItemID === 'profile-container' || navItemID === 'navLinks') {
                            if (evt.keyCode === EaseConstant.keyCodes.ENTER || evt.keyCode === EaseConstant.keyCodes.DOWN_ARROW) {
                                showHideMenu();
                                evt.stopPropagation();
                                evt.preventDefault();
                            }
                        }
                        return true;
                    });
                    var clickEvent = function (event) {
                        var elementIsPresentInDom = $document[0].getElementById(element[0].id);
                        if (!elementIsPresentInDom) {
                            $document.off('click', clickEvent);
                            return;
                        }
                        var headerElems = element[0].parentNode;
                        var linksElems = document.getElementById('name_drop');
                        var pointer = event.target;
                        while (pointer.parentElement && (pointer.id !== 'navLinks' && pointer.id !== 'profile-container')) {
                            pointer = pointer.parentElement;
                        }
                        if (pointer.id === 'navLinks' || pointer.id === 'profile-container') {
                            showHideMenu();
                            return false;
                        }
                        var ele = angular.element(linksElems);
                        if (ele.hasClass('slidedown')) {
                            $timeout(function () {
                                ele.removeClass('slidedown');
                                ele.addClass('slideup');
                                ele.off('keydown');
                                angular.element(document.getElementById('profileLink')).removeClass('clicked');
                            }, 200);
                        }
                    };
                    $document.on('click', clickEvent);
                }
            };
        }
    ])
        .directive('easeHeader', function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: '/ease-ui/dist/features/SummaryHeader/html/SummaryHeader-index.html',
            controller: 'easeHeaderController',
            controllerAs: 'headerCtrl'
        };
    })
        .directive('sidebarCaptureTabletEvents', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var isTabOnLastElementOfTabletSidebar = function (event) {
                        return (event.key === 'Tab' &&
                            !event.shiftKey &&
                            event.target.classList.contains('global-navigation-sidebar__end') &&
                            event.target.getAttribute('aria-expanded') === 'true');
                    };
                    var overlayEl = element[0].getElementsByClassName('global-navigation-sidebar__overlay')[0];
                    overlayEl.addEventListener('touchmove', function (event) {
                        event.preventDefault();
                    });
                    element.bind('keydown', function (event) {
                        if (isTabOnLastElementOfTabletSidebar(event)) {
                            event.preventDefault();
                            var currElement = event.target;
                            currElement.focus();
                        }
                    });
                }
            };
        }
    ])
        .controller('easeHeaderController', easeHeaderController);
    easeHeaderController.$inject = [
        '$rootScope',
        '$state',
        'EASEUtilsFactory',
        'EaseConstant',
        'pubsubService',
        'ContentConstant',
        'featureToggleFactory',
        'summaryService',
        '$scope',
        '$timeout',
        'i18nContent',
        'easeUIModalService',
        '$ocLazyLoad',
        'easeCoreFiles',
        '$location',
        'enoChatUtils',
        'pluginsService',
        'customerPlatformDetailsFactory',
        '$q',
        '$injector',
        '$log',
        'LogoutInterstitialService',
        'globalNavigationUtils',
        'angularElementsUtils'
    ];
    function easeHeaderController($rootScope, $state, EASEUtilsFactory, EaseConstant, pubsubService, ContentConstant, featureToggleFactory, summaryService, $scope, $timeout, i18nContent, easeUIModalService, $ocLazyLoad, easeCoreFiles, $location, enoChatUtils, pluginsService, customerPlatformDetailsFactory, $q, $injector, $log, LogoutInterstitialService, globalNavigationUtils, angularElementsUtils) {
        var vm = this;
        vm.globalNavigationUtils = globalNavigationUtils;
        vm.enoIcon = EaseConstant.enoIcon;
        pluginsService.registerQueryParam('enoChat', enoChatUtils.launchEnoModal.bind(enoChatUtils));
        vm.prevStates = [];
        vm.currentParent = { name: $state.current.name, params: $state.params };
        vm.backClicked = false;
        // models
        angular.extend(vm, {
            headerOptions: EaseConstant.easeHeaderOptions,
            easeCapLogoLink: EaseConstant.states,
            loadingBack: '',
            enableDisplayAlerts: false,
            i18nContent: i18nContent
        });
        var destroyDisable = $rootScope.$on('disable', function (evt, args) {
            vm.pending = args;
        });
        // destroy disable event
        $scope.$on('$destroy', destroyDisable);
        // methods
        angular.extend(vm, {
            getProfileImage: function () {
                return vm.profilePictureData;
            },
            navigateTo: function (slug) {
                if (vm.pending) {
                    return;
                }
                $state.go(slug);
            },
            goBack: function () {
                vm.pending = true;
                vm.loadingBack = 'loading';
                pubsubService.pubsubTrackAnalytics({ name: 'back:button' });
                vm.backClicked = true;
                if (vm.prevStates && vm.prevStates.length > 1) {
                    var newState = vm.prevStates.pop();
                    $state.go(newState.name, newState.params);
                }
                else {
                    // no previous states visited, go back to account summary
                    $state.go(EaseConstant.states.kAccountSummary);
                }
            },
            sendButtonEvent: function () {
                pubsubService.pubsubTrackAnalytics({ name: 'capitalone:button' });
                if ($state.current.name === EaseConstant.states.kAccountSummary) {
                    $state.reload();
                }
            },
            isEnoDisabled: function () {
                return enoChatUtils.isEnoClicked;
            },
            isDocumentCenterEnabled: function () {
                return vm.documentCenterToggle;
            }
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            vm.pending = false;
            var backButtonPath = [
                'logout',
                'welcome',
                EaseConstant.states.kVerify,
                'ContactInfo',
                'accountSummary',
                'SummAccPrefAddExtAccount',
                'escid',
                'EnoChat',
                EaseConstant.states.kUpdateInfo,
                EaseConstant.states.kLinkAccount
            ];
            vm.isBackButton = !backButtonPath.some(function (val) {
                var reg = new RegExp(val, 'i');
                return reg.test(toState.name);
            });
            var isProfilePath = [
                'logout',
                'welcome',
                EaseConstant.states.kVerify,
                'ContactInfo',
                'escid',
                EaseConstant.states.kUpdateInfo,
                EaseConstant.states.kLinkAccount
            ];
            vm.isProfile = vm.isFeedBackButton = !isProfilePath.some(function (val) {
                var reg = new RegExp(val, 'i');
                if (reg.test(toState.name)) {
                    vm.globalNavigationUtils.centerCapitaoneLogo = true;
                }
                return reg.test(toState.name);
            });
            vm.loadingBack = '';
            vm.disableCapitalOneLogo = !!toState.data && toState.data.disableCapitalOneLogo;
            angular.element(document.getElementById('profileLink')).removeClass('clicked');
            if (!$state.includes(vm.currentParent.name)) {
                if (!vm.backClicked && vm.currentParent.name !== '') {
                    vm.prevStates.push(vm.currentParent);
                }
                vm.currentParent = { name: toState.name, params: toParams, url: toState.url };
                if (vm.currentParent.name === 'mainState') {
                    vm.currentParent.name = EaseConstant.states.kAccountSummary;
                }
                else if ($state.includes(vm.currentParent.name) && !$state.includes(vm.currentParent.params.accountReferenceId)) {
                    if (vm.currentParent.url === '' && vm.currentParent.params.accountReferenceId !== toParams.accountReferenceId) {
                        if (!vm.backClicked) {
                            vm.prevStates.push(vm.currentParent);
                        }
                        vm.currentParent = { name: toState.name, params: toParams, url: toState.url };
                    }
                }
            }
            else if ($state.includes(vm.currentParent.name) && !$state.includes(vm.currentParent.params.accountReferenceId)) {
                if (vm.currentParent.url === '' && vm.currentParent.params.accountReferenceId !== toParams.accountReferenceId) {
                    if (!vm.backClicked) {
                        vm.prevStates.push(vm.currentParent);
                    }
                    vm.currentParent = { name: toState.name, params: toParams, url: toState.url };
                }
            }
            vm.backClicked = false;
            vm.globalNavigationUtils.toggleBottomNavTestUI(toState.name, vm.globalNavigationUtils.AB_TEST.bottom_nav.experience);
            vm.globalNavigationUtils.AB_TEST.global_nav.uppMenu.expanded = false;
            vm.globalNavigationUtils.updateHighlighter(toState);
            vm.globalNavigationUtils.updateHomeIcon(toState);
            vm.globalNavigationUtils.collapseMenu();
        });
        $rootScope.$on('logout', function () {
            vm.isFeedBackButton = vm.isBackButton = vm.isProfile = false;
        });
        $rootScope.$on('error', function ($state) {
            var state = $state.currentScope.$state.current;
            vm.isBackButton = !(state.data && state.data.hideBackButton);
        });
        function summaryLoadedHandler() {
            var featureToggleDataPromise = featureToggleFactory.initializeFeatureToggleData();
            featureToggleDataPromise
                .then(function (featureToggleData) {
                vm.enableDisplayAlerts = EASEUtilsFactory.isShowAlerts(featureToggleData, summaryService.getLobArray());
                vm.documentCenterToggle = featureToggleData[EaseConstant.features.enableShowDocumentCenter];
                if (featureToggleData[EaseConstant.features.enableAngularHeader]) {
                    getAngularHeaderDependencies();
                    vm.showAngularHeader = true;
                }
            })
                .catch(function (e) {
                vm.enableDisplayAlerts = false;
                $log.error('SummaryHeader was not able to load feature toggles', e);
            });
        }
        var getAngularHeaderDependencies = function () {
            angularElementsUtils
                .getAngularElementsDependencies()
                .then(function () {
                angularElementsUtils.getAngularElementsFeature(['ease-web-core-header']);
            })
                .catch(function (e) {
                $log.error('Unable to get Angular Header dependencies', e);
            });
        };
        var unbindFeatureToggleReadyListener = $rootScope.$on('featureToggleReady', summaryLoadedHandler);
        $scope.$on('$destroy', unbindFeatureToggleReadyListener);
        var unbindSummaryLoadedListener = $rootScope.$on('summaryLoaded', summaryLoadedHandler);
        $scope.$on('$destroy', unbindSummaryLoadedListener);
    }
});
