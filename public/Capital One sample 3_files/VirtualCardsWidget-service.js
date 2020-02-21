define(["require","exports","angular"],function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e,a,r,n,i,o){var s=this;this.EaseConstant=t,this._=e,this.i18nContent=a,this.$log=r,this.goTapService=n,this.detectBrowser=i,this.featureToggleFactory=o,this.virtualCardEnrolledState={widgetName:"VirtualCards",state:"Enrolled",icon:this.EaseConstant.virtualCardsEnoCardsIcon,title:this.i18nContent["ease.core.widget.virtualcards.enrolled.title"],content:{bodyText:this.i18nContent["ease.core.widget.virtualcards.enrolled.bodyText"],linkText:this.i18nContent["ease.core.widget.virtualcards.linkToPage"]},images:this.EaseConstant.virtualCardsDownload,cta1Text:this.i18nContent["ease.core.widget.virtualcards.linkToPage"]},this.virtualCardUnenrolledState={widgetName:"VirtualCards",state:"Unenrolled",icon:this.EaseConstant.virtualCardsEnoCardsIcon,title:this.i18nContent["ease.core.widget.virtualcards.notEnrolled.title"],content:{bodyText:this.i18nContent["ease.core.widget.virtualcards.notEnrolled.bodyText"],linkText:this.i18nContent["ease.core.widget.virtualcards.downloadGo"]},images:this.EaseConstant.virtualCardsDownload,cta1Text:this.i18nContent["ease.core.widget.virtualcards.downloadGo"]},this.areVirtualCardCallsSuccessful=function(t){return s._isCardAccount(t)?s.goTapService.getPaymentCardDataPreference().then(function(e){return s._parseVirtualCardPaymentCardResponse(e,t)})["catch"](function(){return!1}):!1},this.getContent=function(){return s.showEnrolled?s.virtualCardEnrolledState:s.showUnenrolled?s.virtualCardUnenrolledState:(s.$log.error("Failed to Load Virtual Cards Widget Content"),{})},this._isCardAccount=function(t){return s._.find(t.accounts,function(t){return"CC"===t.category})},this._setVirtualCardFields=function(t,e){var a=s.featureToggleFactory.getFeatureToggleData(),r=a[s.EaseConstant.features.hideUnenrolledVirtualCardsWidget];s.showEnrolled=t===s.EaseConstant.kVirtualCards.http.ok,s.showUnenrolled=r||t!==s.EaseConstant.kVirtualCards.http.nocontent?!1:s.detectBrowser.browsers().isChromeOrFirefox},this._parseVirtualCardPaymentCardResponse=function(t,e){return t.status===s.EaseConstant.kVirtualCards.http.ok&&t.data&&t.data.plain().hasEligibleCards&&!t.data.plain().isAllCardsFraudLocked?s.goTapService.getVirtualCardsPreference().then(function(t){return s._setVirtualCardFields(t.status,e),s.showEnrolled||s.showUnenrolled})["catch"](function(t){return!1}):!1}}return t.$inject=["EaseConstant","_","i18nContent","$log","goTapService","detectBrowser","featureToggleFactory"],t}();e.VirtualCardsWidgetService=r,a.module("WidgetAreaModule").service("VirtualCardsWidgetService",r)});