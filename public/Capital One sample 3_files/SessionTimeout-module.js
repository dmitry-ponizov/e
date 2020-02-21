define(['angular', 'coreloader'], function (angular, coreloader) {
    'use strict';
    angular
        .module('SessionTimeoutModule', ['easeAppUtils'])
        .controller('SessionTimeoutController', SessionTimeoutController)
        .controller('summaryError', summaryErrorController);
    SessionTimeoutController.$inject = [
        '$injector',
        '$scope',
        '$rootScope',
        '$compile',
        '$interval',
        '$state',
        'EaseConstant',
        'EASEUtilsFactory',
        'Idle',
        'ContentConstant',
        '$document',
        'ChatService',
        'i18nContent',
        'Title'
    ];
    function SessionTimeoutController($injector, $scope, $rootScope, $compile, $interval, $state, EaseConstant, EASEUtilsFactory, Idle, ContentConstant, $document, ChatService, i18nContent, Title) {
        var vm = this;
        var warningTime = '';
        var documentBody = document.body;
        function closeModal() {
            var sessionDiv = document.getElementById('sessionDiv');
            vm.displayTimeout = '';
            if (vm.pageContent) {
                vm.pageContent.setAttribute('aria-hidden', 'false');
            }
            if (sessionDiv) {
                documentBody.removeChild(sessionDiv);
            }
        }
        angular.extend(vm, {
            timeUnit: 'seconds',
            initClose: false,
            isIdle: false,
            contentData: '',
            focusId: '',
            pageContent: $document[0].getElementById('page-content'),
            signOut: function () {
                $rootScope.$emit('IdleTimeout');
            },
            close: function () {
                closeModal();
                ChatService.sendHeartBeatCheck();
            },
            displayTimeout: '',
            modalType: 'timeoutModal'
        });
        $rootScope.$on('IdleStart', function () {
            Title.idleMessage('{{minutes}}:{{seconds}} ' + i18nContent['ease.core.session.timeout.title']);
            vm.isIdle = true;
            vm.i18nContent = i18nContent;
            vm.displayTimeout = '/ease-ui/dist/features/SessionTimeout/html/SessionTimeout-index.html';
            if (vm.pageContent) {
                vm.pageContent.setAttribute('aria-hidden', 'true');
            }
            var sessionHtml = '<div id="sessionDiv"><div data-ng-include=timeout.displayTimeout></div></div>';
            var sessionElement = $compile(sessionHtml)($scope);
            angular.element(documentBody).append(sessionElement);
        });
        $rootScope.$on('IdleTimeout', function () {
            closeModal();
            $state.go('logout', {}, { location: false });
        });
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        $rootScope.$on('IdleEnd', function () {
            $scope.$apply(function () {
                Title.value(Title.value());
                vm.isIdle = false;
            });
        });
    }
    summaryErrorController.$inject = [
        '$scope',
        '$rootScope',
        '$document',
        '$timeout',
        'languagePreferencesFactory',
        'ContentConstant',
        'i18nContent',
        '$compile'
    ];
    function summaryErrorController($scope, $rootScope, $document, $timeout, languagePreferencesFactory, ContentConstant, i18nContent, $compile) {
        var vm = this;
        var documentBody = document.body;
        function keyCheck(errorMessage) {
            if (!angular.isDefined(errorMessage)) {
                return true;
            }
            var keyStart = errorMessage.substr(0, errorMessage.indexOf('.'));
            if (keyStart === 'ease' || keyStart === 'core') {
                return true;
            }
            else {
                return false;
            }
        }
        angular.extend(vm, {
            keepWebviewOpen: false,
            initClose: false,
            modalType: 'errorModal',
            errorModal: '',
            pageContent: $document[0].getElementById('page-content'),
            close: function () {
                vm.errorModal = '';
                vm.modalType = '';
                var errorDiv = document.getElementById('errorDiv');
                if (vm.pageContent) {
                    vm.pageContent.setAttribute('aria-hidden', 'false');
                }
                if (coreloader.isNativeMobileApp() && !vm.keepWebviewOpen) {
                    coreloader.postClose();
                }
                $rootScope.$broadcast('snag', 'closed');
                if (angular.isFunction(vm.onClose)) {
                    vm.onClose();
                    vm.onClose = null;
                }
                if (errorDiv) {
                    documentBody.removeChild(errorDiv);
                }
            }
        });
        $rootScope.$on('error', function (event, args) {
            vm.isPolicy = args.isPolicy;
            vm.keepWebviewOpen = !!args.keepWebviewOpen;
            vm.errorMsg = args;
            var contentData = i18nContent;
            var contentExists = angular.isDefined(contentData);
            var errorDiv = document.getElementById('errorDiv');
            if (contentExists && angular.isDefined(contentData[vm.errorMsg.msgBody])) {
                vm.errorMsg.msgBody = contentData[vm.errorMsg.msgBody];
            }
            else if (keyCheck(vm.errorMsg.msgBody)) {
                vm.errorMsg.msgBody = ContentConstant.kcommon_snag_en_US.common_snag_en_US['core.common.snag.modal.header2'];
            }
            if (contentExists && contentData[vm.errorMsg.msgHeader]) {
                vm.errorMsg.msgHeader = contentData[vm.errorMsg.msgHeader];
            }
            else if (keyCheck(vm.errorMsg.msgHeader)) {
                vm.errorMsg.msgHeader = ContentConstant.kcommon_snag_en_US.common_snag_en_US['core.common.snag.modal.header2'];
            }
            if (contentExists && contentData[ContentConstant.kSnagFeatureOffButtonLabel]) {
                vm.errorMsg.msgButton = contentData[ContentConstant.kSnagFeatureOffButtonLabel];
            }
            else if (keyCheck(vm.errorMsg.msgButton)) {
                vm.errorMsg.msgButton = ContentConstant.kcommon_snag_en_US.common_snag_en_US[ContentConstant.kSnagFeatureOffButtonLabel];
            }
            vm.modalClass = '';
            vm.modalType = coreloader.isNativeMobileApp() ? 'errorModal webViewModal' : 'errorModal';
            vm.errorModal = '/ease-ui/dist/features/AccountSummary/html/partials/error-partial.html';
            if (errorDiv) {
                documentBody.removeChild(errorDiv);
            }
            var errorHtml = '<div id="errorDiv"><div data-ng-include=error.errorModal></div></div>';
            var errorElement = $compile(errorHtml)($scope);
            angular.element(documentBody).append(errorElement);
            if (args.onClose) {
                vm.onClose = args.onClose;
            }
            else {
                vm.onClose = null;
            }
            $timeout(function () {
                if (vm.pageContent) {
                    vm.pageContent.setAttribute('aria-hidden', 'true');
                }
                else {
                    vm.pageContent.setAttribute('aria-hidden', 'false');
                }
            }, 100);
        });
    }
});
