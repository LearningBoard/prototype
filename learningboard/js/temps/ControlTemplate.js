define(["temps/Template"], function(Template) {

  var ControlTemplate = function($template) 
  {
    this.subscribers = [];
    Template.call(this, $template);
  }

  $.extend(ControlTemplate.prototype, Template.prototype);

  ControlTemplate.prototype.register = function()
  {
    var len = arguments.length;
    console.log(arguments);
    for (var ii = 0; ii < len; ii++)
    {
      this.subscribers.push(arguments[ii]);
    }
    console.log(this.subscribers);
  }

  return ControlTemplate;

});