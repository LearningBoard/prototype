define(['temps/Template'], function(Template) {
  "use strict";

  var DefaultActivityTemplate = function() {
    var $html = "<p><i>Errors occur when rendering activity</i></p>";
    Template.call(this, $html)
  };

  $.extend(DefaultActivityTemplate.prototype, Template.prototype);
  return DefaultActivityTemplate;

});
