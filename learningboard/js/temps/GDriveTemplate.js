define(['temps/Template'], function(Template) {
  "use strict";

  var GDriveTemplate = function() {
    var $html = "<p><i>Error occur when rendering activity</i></p>";
    Template.call(this, $html)
  };

  $.extend(GDriveTemplate.prototype, Template.prototype);

  return GDriveTemplate;

});