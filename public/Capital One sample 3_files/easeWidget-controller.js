define(["require","exports","angular"],function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t,i,s,o,n){var l=this;this.$timeout=e,this.$scope=t,this.$element=i,this.$window=s,this.$log=o,this.$rootScope=n,this._resizeBinding=function(){l.$timeout(function(){l.onResize(l.widgetElement,l.imageElement)},0)},this.setDefaultValues(),this.widgetElement=this.$element[0].getElementsByClassName("ease-widget")[0],this.imageElement=this.$element[0].getElementsByClassName("ease-widget__image")[0]}return e.prototype.toggleMobileCollapse=function(){this.isMobileCollapseEnabled&&this.isCurrentlyMobileView&&(this.isMobileCollapsed=!this.isMobileCollapsed)},e.prototype.shouldHideContainer=function(){return this.isMobileCollapseEnabled&&this.isCurrentlyMobileView&&this.isMobileCollapsed},e.prototype.clickCallToAction1=function(){this.callToAction1()},e.prototype.clickCallToAction2=function(){this.callToAction2()},e.prototype.refreshComponent=function(){this.refresh()},e.prototype.setDefaultValues=function(){this.initialImageClass=this.imageClass=this.$scope.widget.imageClass||"ease-widget-default-image",this.contentClass=this.$scope.widget.contentClass||"ease-widget__content"},e.prototype.resizeImage=function(e,t){this.imageClass=this.initialImageClass;var i;return 362>t?(e.className="ease-widget widget-mobile-tag ease-widget--small",i=this.$scope.widget.smallImage):752>t?(e.className="ease-widget widget-mobile-tag ease-widget--medium",i=this.$scope.widget.mediumImage):(e.className="ease-widget widget-mobile-tag ease-widget--large",i=this.$scope.widget.largeImage),i||(this.imageClass="no-image"),i},e.prototype.setImageStyle=function(e,t){e.style.backgroundImage="url("+t+")"},e.prototype.onRefresh=function(){this.onResize(this.widgetElement,this.imageElement)},e.prototype.onResize=function(e,t){var i=this.$window.getComputedStyle(e);this.width=e.clientWidth-(parseFloat(i.paddingLeft)+parseFloat(i.paddingRight)),this.image=this.resizeImage(e,this.width),this.setImageStyle(t,this.image),this.$window.matchMedia("only screen and (max-width  : 600px)").matches?this.isCurrentlyMobileView=!0:this.isCurrentlyMobileView=!1},e.prototype.$onInit=function(){var e=this;this.$timeout(function(){e.onResize(e.widgetElement,e.imageElement),i.element(e.$window).on("resize",e._resizeBinding),e.updateContentEvent&&(e.updateEvent=e.$rootScope.$on(e.updateContentEvent,e._resizeBinding)),e.refreshComponent()})},e.prototype.$onDestroy=function(){i.element(this.$window).off("resize",this._resizeBinding),this.updateEvent&&this.updateEvent()},e.$inject=["$timeout","$scope","$element","$window","$log","$rootScope"],e}();t.EaseWidgetController=s,i.module("EaseWidgetModule").controller("EaseWidgetController",s)});