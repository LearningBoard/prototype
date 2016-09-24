define(['config', 'temps/DefaultActivityTemplate'], function(config, DefaultActivityTemplate) {
  "use strict";

  var tmp;
  var actTypes = config.actTypes || {};

  var expo = {
    activities: {
      getTypes: function() {return Object.keys(actTypes)},
      getView: function(type) {
        return new Promise(function(resolve, reject) {
          require([actTypes[type].view], function(){
            tmp = arguments[0] || DefaultActivityTemplate;
            resolve(tmp);
          }, function(err) {
            console.log(err);
            tmp = DefaultActivityTemplate;
            resolve(tmp);
          });
        });
      },

      getCreateFormView: function (type) {
        return new Promise(function(resolve, reject) {
          require([actTypes[type].createFormView], function(){
            tmp = new arguments[0]();
            resolve(tmp);
          }, function(err) {
            throw err;
            resolve();
          });
        });
      }
    }
  };

  return expo;

});
