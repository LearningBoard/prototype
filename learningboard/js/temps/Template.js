define(function() {
  "use strict";

  var Template = function($template) {
    // provides a display function for its children
    this.$template = $template;
  };

  Template.prototype.display = function()
  {
    for (var i = 0; i < arguments.length; ++i)
      arguments[i].append(this.$template);
    this.displaying = true;
  };

  Template.prototype.remove = function() 
  {
    this.$template.remove();
  }

  return Template;
})
