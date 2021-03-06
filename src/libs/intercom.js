import config from 'constants/config';

const Intercom = {
  init: () => {
    window.Intercom('boot', {
       'app_id': config.INTERCOM.appId,
    });
  },

  track: (event) => {
    window.Intercom('trackEvent', event);
  },
};

(function(){const w=window;const ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{const d=document;const i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;const l=function(){const s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + config.INTERCOM.appId;const x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

export default Intercom;
