define(['util', 'temps/FileListTemplate'], function(util, FileListTemplate) {
  "use strict";

  var GFileListTemplate = function(gFileTemps) {
    FileListTemplate.call(this, gFileTemps);
  }

  $.extend(GFileListTemplate.prototype, FileListTemplate.prototype);

  return GFileListTemplate;

});