Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;Bootstrapper.insertScript("https://www.googletagmanager.com/gtag/js?id\x3dAW-1072257247");window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag("js",new Date)},2965488,528068);
Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;Bootstrapper.registerDataDefinition(function(){Bootstrapper.data.define({extract:function anonymous(){return document.location.pathname},load:"instance",trigger:Bootstrapper.data.bottomOfBodyTrigger,dataDefName:"getPath",collection:"Utility",source:"Manage",priv:"false"},{id:"22496"})},22496)},-1,-1);
Bootstrapper.bindDOMParsed(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;!function(a,b){var c,d;c=function(){function a(a,b,c){c[b]=a&&a.trim()}function b(a){return!!a}var c=arguments;if(c.length){var d,e=new RegExp("^[:|,-]"),f=c[0].match(e),g=f?[].shift.call(c):":";return[].forEach.call(c,a),d=[].filter.call(c,b),[].join.call(d,g)}},d=function(a){var b=function(a){return/^\/bank/.test(a)},c=function(a){return a.replace(/[^\/]{30,}/gi,"refId")},
d=function(a,b){return{event_category:a,event_label:b}};return function(e,f){var g=":";f.dataLayer=f.dataLayer||[];var h=function(){f.dataLayer.push(arguments)};h("config",e,{send_page_view:!1});var i=function(){var a=["event"];a=a.concat([].slice.call(arguments)),h.apply(null,a)};return{track:function(d){var i=[],j={send_to:e},k={},l=f.location.pathname;if(d.taxonomy){var m=d.taxonomy.level1,n=d.taxonomy.level2,o=d.taxonomy.level3,p=d.taxonomy.level4,q=d.taxonomy.level5,r=a(m,n,o,p,q);if(!b(l)){var s=
"ease_web"===d.taxonomy.system;i=i.concat(["config",e,{page_path:s?c(l):l,page_title:r}])}}else{if(i.push("event"),d.carouselStatus)i.push("Status"),k={event_category:"Carousel",event_label:d.carouselStatus};else if(d.searchTerm)i.push("search"),k={search_term:d.searchTerm};else if(d.name){var t=d.name.split(g),u=t.pop(),v=t.join(g);i.push(u),k={event_category:d.category||"Generic",event_label:v}}else if(d.nav){var w,x,y,z=d.nav.split(g);z.length>2?(w=z.shift(),x=z.shift(),y=z.join(g)):(w="click",
x="nav",y=d.nav),i.push(w),k={event_category:x,event_label:y}}Object.keys(k).length>0&&(k=Object.assign(k,j),i.push(k))}i.length>1&&h.apply(null,i)},trackPageView:function(b){var d=b.scDLLevel1,g=b.scDLLevel2,i=b.scDLLevel3,j=b.scDLLevel4,k=b.scDLLevel5,l=a(d,g,i,j,k);h("config",e,{page_path:c(f),page_title:l})},trackLinkClicked:function(a){i("Clicked",d("Link",a.linkName))},trackNavClicked:function(a){i("Clicked",d("Nav",a.navName))},trackButtonClicked:function(a){i("Clicked",d("Button",a.buttonName))},
trackFormFieldClicked:function(a){i("Clicked",d("Form Field",a.formfieldName))},trackDrawerCloseClicked:function(a){i("Close",d("Drawer",a.drawerName))},trackDrawerOpenClicked:function(a){i("Open",d("Drawer",a.drawerName))},trackDropDownClicked:function(a){i("Selected",d("DropDown",a.dropdownText))},trackTiming:function(a){i("timing_complete",{event_category:a.timingCategory,name:a.timingVar,value:a.timingValue,event_label:a.timingLabel})},trackError:function(a){i("exception",{description:a.exceptionDescription,
fatal:a.isFatal})}}}}(c);var e=b.isProd?"UA-84753935-1":"UA-84753935-2",f=d(e,a);a.publisherFW.addListenerMap("ga",{trackAnalytics:{isEnabled:!0,track:f.track},pageView:{isEnabled:!0,track:f.trackPageView},linkClicked:{isEnabled:!0,track:f.trackLinkClicked},navClicked:{isEnabled:!0,track:f.trackNavClicked},buttonClicked:{isEnabled:!0,track:f.trackButtonClicked},formfieldClicked:{isEnabled:!0,track:f.trackFormFieldClicked},drawerClose:{isEnabled:!0,track:f.trackDrawerCloseClicked},drawerOpen:{isEnabled:!0,
track:f.trackDrawerOpenClicked},dropdownSelected:{isEnabled:!0,track:f.trackDropDownClicked},timing:{isEnabled:!0,track:f.trackTiming},error:{isEnabled:!0,track:f.trackError}})}(window,Bootstrapper)},3122548,545731);