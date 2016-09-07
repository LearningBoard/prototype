define(['config', 'fbsdk'], function(config, fb) {
  "use strict";
  
  FB.init({
    appId   : config.facebook.appId,
    version : config.facebook.apiVersion
  });

})