define(['temps/VideoTemplate', 'temps/TextTemplate', 'temps/CodeTemplate', 'temps/AudioTemplate', 'temps/GDriveTemplate', 'temps/ODriveTemplate', 'temps/DefaultActivityTemplate'], function(VideoTemplate, TextTemplate, CodeTemplate, AudioTemplate, GDriveTemplate, ODriveTemplate, DefaultActivityTemplate) {
  "use strict";

  var tmp;
  var actTypes = {
    'video': {
      createFormView: 'temps/activities/VideoFormTemplate'
    },
    'text': {
      createFormView: 'temps/activities/TextFormTemplate'
    },
    'code': {
      createFormView: 'temps/activities/CodeFormTemplate'
    },
    'audio': {
      createFormView: 'temps/activities/AudioFormTemplate'
    },
    'gdrive': {
      createFormView: 'temps/activities/GDriveFormTemplate'
    },
    'odrive': {
      createFormView: 'temps/activities/ODriveFormTemplate'
    }
  };

  var expo = {
    activities: {
      getTypes: function() {return Object.keys(actTypes)},
      getView: function(type) {
        switch(type)
        {
          case 'video':
            tmp = VideoTemplate;
            break;
          case 'text':
            tmp = TextTemplate;
            break;
          case 'code':
            tmp = CodeTemplate;
            break;
          case 'audio':
            tmp = AudioTemplate;
            break;
          case 'gdrive':
            tmp = GDriveTemplate;
            break;
          case 'odrive':
            tmp = ODriveTemplate;
            break;
          default:
            tmp = DefaultActivityTemplate;
            break;
        }
        return tmp;
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
