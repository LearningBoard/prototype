define(['config', 'fbsdk'], function(config) {
  "use strict";
  
  FB.init({
    appId   : config.facebook.appId,
    version : config.facebook.apiVersion
  });

})