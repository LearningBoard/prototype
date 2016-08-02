define(['temps/Template'], function(Template) {
  "use strict";

  var DefaultActivityTemplate = function() {
    var $html = "<p><i>Error occur when rendering activity</i></p>";
    Template.call(this, $html)
  };

  return DefaultActivityTemplate;

});
