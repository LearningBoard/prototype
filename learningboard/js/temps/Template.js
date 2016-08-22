define(function() {
  "use strict";

  var Template = function($template) {
    // provides a display function for its children
    this.$template = $template;
    if (this.onBeforeUnload)
    {
      var self = this;
      $(window).unload(function() {
        self.onBeforeUnload();
      });
    }
  };

  Template.prototype.display = function()
  {
    if (this.$template === undefined) 
      throw new TypeError("Required property $template is undefined");
    for (var i = 0; i < arguments.length; ++i)
      arguments[i].append(this.$template);
  };

  Template.prototype.remove = function() 
  {
    this.$template.remove();
  }

  /*
  Template.prototype.onBeforeUnload = function(event)
  {
  }
  */

  return Template;
})
