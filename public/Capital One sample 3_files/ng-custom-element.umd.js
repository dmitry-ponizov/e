!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.ngCustomElement=t()}(this,function(){function n(n){return n.toLowerCase().replace(t,"").replace(e,"").replace(/_(.)/g,function(n,t){return t.toUpperCase()})}var t=/^((?:x|data)[:\-_])/,e=/^ngce[:\-_][^:\-_]+[:\-_]/,r=["$exceptionHandler","$parse","$rootScope",function(t,e,r){function o(n){try{n()}catch(n){t(n)}}var i=/^(on[a-z]+|formaction)$/;return{restrict:"A",priority:100,compile:function(t,c){var u=Object.keys(c).filter(function(n){return n.startsWith("ngceProp")}).map(function(t){return[n(c.$attr[t]),e(c[t])]}),a=Object.keys(c).filter(function(n){return n.startsWith("ngceOn")}).map(function(t){return[n(c.$attr[t]),e(c[t])]});return{pre:function(n,t){var e=u.map(function(e){var r=e[0],o=e[1];if(i.test(r))throw new Error("Property bindings for HTML DOM event properties are disallowed.");return n.$watch(o,function(e){n.$applyAsync(function(){t.prop(r,e)})})});t.on("$destroy",function(){return e.forEach(o)})},post:function(n,t){a.forEach(function(e){var i=e[1];t.on(e[0],function(t){var e=i.bind(null,n,{$event:t=t.originalEvent||t});r.$$phase?o(e):n.$apply(e)})})}}}}}];return angular.module("ngCustomElement",[]).directive("ngCustomElement",r).name});