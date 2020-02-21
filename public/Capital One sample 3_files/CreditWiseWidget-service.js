var __assign=this&&this.__assign||function(){return __assign=Object.assign||function(e){for(var t,i=1,r=arguments.length;r>i;i++){t=arguments[i];for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s])}return e},__assign.apply(this,arguments)};define(["require","exports","angular"],function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t,r,s,n,o,a){var l=this;this.EaseConstant=e,this.i18nContent=t,this.$log=r,this.EaseCoreRestangularFullResponse=s,this.EASEUtilsFactory=n,this.creditKeeperUtils=o,this.featureToggleFactory=a,this.creditWiseBaseState={widgetName:this.EASEUtilsFactory.isCanada()?"Credit Keeper™":"CreditWise",icon:this.EaseConstant.creditWiseIcon,title:this.EASEUtilsFactory.isCanada()?"Credit Keeper™":"CreditWise"},this.creditWiseNotEnrolledState=__assign({state:"Unenrolled",content:{bodyTitle:this.i18nContent["ease.core.widget.creditwise.unenrollscoretitle.label"],bodyText:this.i18nContent["ease.core.widget.creditwise.unenrollpropdesctxt.label"],linkText:this.EASEUtilsFactory.isCanada()?this.i18nContent["ease.core.widget.creditwise.protectcreditlink.label"]:this.i18nContent["ease.core.widget.creditwise.unenrollactivatelink.label"],pubsubAnalyticsText:"Activate now: button"}},this.creditWiseBaseState),this.creditWiseNotEligibleForScoreRefreshState=__assign({state:"NotEligibleForRefresh",content:{bodyTitle:this.i18nContent["ease.core.widget.creditwise.enrollpropdesctxt.label"],bodyText:this.i18nContent["ease.core.widget.creditwise.lastupdtxt.label"],bodyInfo:this.i18nContent["ease.core.widget.creditwise.nextupdttxt.label"],linkText:this.i18nContent["ease.core.widget.creditwise.seemorerefcreditlink.label"],pubsubAnalyticsText:"Protect your credit now:button"}},this.creditWiseBaseState),this.creditWiseEligibleForScoreRefreshState=__assign({state:"EligibleForRefresh",content:{bodyTitle:this.i18nContent["ease.core.widget.creditwise.enrollrefpropdesctxt.label"],bodyText:this.i18nContent["ease.core.widget.creditwise.lastupdtxt.label"],bodyInfo:this.i18nContent["ease.core.acctsummary.creditwise.updatedscore.label"],linkText:this.i18nContent["ease.core.widget.creditwise.seemorerefcreditlink.label"],pubsubAnalyticsText:"See your score and more:button"}},this.creditWiseBaseState),this.getContent=function(){return l.isUserEnrolled&&l.isUserEligibleForScoreRefresh?l.creditWiseEligibleForScoreRefreshState:l.isUserEnrolled&&!l.isUserEligibleForScoreRefresh?l.creditWiseNotEligibleForScoreRefreshState:l.creditWiseNotEnrolledState},this.getCreditScore=function(){var e=l.featureToggleFactory.getFeatureToggleData(),t=e[l.EaseConstant.features.enableDevXCreditWiseUrl],r=t?l.EaseConstant.kCreditWiseUrl:l.EaseConstant.kCreditWiseCloudFrontUrl,s=l.EASEUtilsFactory.isCanada()?l.EaseConstant.kCreditKeeperUrl:r;if(l.creditWisePromise)return l.creditWisePromise;if(l.EASEUtilsFactory.isCanada())l.creditWisePromise=l.creditKeeperUtils.getCreditKeeperPromise().then(function(e){var t=i.isObject(e.data)?e.data:{};return t.enrolled=e&&200===e.status?!0:!1,t.lastRefreshedDate=t.pullDate||!1,t.enrolled=t.creditScore?!0:!1,l.setCreditWiseWidgetFields(t.enrolled,t.eligibleForScoreRefresh),t},function(e){return l._handleError("Failed to fetch CreditKeeper response: "+e),{enrolled:!1}});else{var n={Accept:"application/json;v=1"},o=l.EaseCoreRestangularFullResponse.withConfig(function(e){e.setBaseUrl(l.EaseConstant.baseCreditWiseApiUrl)});l.creditWisePromise=o.one(s).withHttpConfig({timeout:4e3}).customGET("",{},n).then(function(e){var t=i.isObject(e.data)?e.data:!1;return t&&e.headers?(t.enrolled="true"===e.headers().enrolled&&t.cachedVantageScore&&200===e.status?!0:!1,l.setCreditWiseWidgetFields(t.enrolled,t.eligibleForScoreRefresh)):l._handleError("CreditWise response is empty or malformed: "+t),t},function(e){return l._handleError("Failed to fetch CreditWise response: "+e),{enrolled:!1}})}return l.creditWisePromise},this._handleError=function(e){l.creditWisePromise=null,l.setCreditWiseWidgetFields(!1,!1),l.$log.error(e)},this.setCreditWiseWidgetFields=function(e,t){l.isUserEnrolled=e,l.isUserEligibleForScoreRefresh=t},this.getCreditScore()}return e.$inject=["EaseConstant","i18nContent","$log","EaseCoreRestangularFullResponse","EASEUtilsFactory","creditKeeperUtils","featureToggleFactory"],e}();t.CreditWiseWidgetService=r,i.module("CreditWiseWidgetModule").service("CreditWiseWidgetService",r)});