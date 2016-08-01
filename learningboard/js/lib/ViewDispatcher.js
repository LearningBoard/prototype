define(['temps/VideoTemplate', 'temps/TextTemplate', 'temps/CodeTemplate', 'temps/AudioTemplate', 'temps/GDriveTemplate'],function(VideoTemplate, TextTemplate, CodeTemplate, AudioTemplate, GDriveTemplate) {
  "use strict";

  var tmp;
  var actTypes = ["video", "text", "code", "audio", "gdrive"];

  var expo = {
    activities: {
      getTypes: function() {return actTypes.slice()},
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
          default:
            tmp = DefaultActivityTemplate;
            break;
        }
        return tmp;
      },

      getCreateFormView: function () {
        switch(type)
        {
          case 'video':
            tmp = new VideoFormTemplate();
            break;
          case 'text':
            tmp = new TextFormTemplate();
            break;
          case 'code':
            tmp = new CodeFormTemplate();
            break;
          case 'audio':
            tmp = new AudioFormTemplate();
            break;
          case 'gdrive':
            tmp = new GDriveFormTemplate();
            break;
          default:
            tmp = new DefaultActivityTemplate();
            break;
        }
        return tmp;
      }
    }
  };

  return expo;

});