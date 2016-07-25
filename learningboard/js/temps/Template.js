define(function() {
  var Template = function($template) {
    // provides a display function for its children
    this.$template = $template;
    this.displayed = false;
  };

  Template.prototype.display = function()
  {
    for (var i = 0; i < arguments.length; ++i)
      arguments[i].append(this.$template);
    this.displaying = true;
  };

  Template.prototype.hide = function()
  {
    this.$template.remove();
    this.displaying = false;
  }
  return Template;
})
