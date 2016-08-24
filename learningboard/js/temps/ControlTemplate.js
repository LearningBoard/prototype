define(["temps/Template"], function(Template) {

  var ControlTemplate = function($template) 
  {
    this.subscribers = [];
    Template.call(this, $template);
  }

  $.extend(ControlTemplate.prototype, Template.prototype);

  ControlTemplate.prototype.display = function() {
    Template.prototype.display.apply(this, arguments)
    this.onActive();
  }

  ControlTemplate.prototype.onActive = function() {}

  ControlTemplate.prototype.register = function()
  {
    var len = arguments.length;
    for (var ii = 0; ii < len; ii++)
    {
      this.subscribers.push(arguments[ii]);
    }
  }

  return ControlTemplate;

});