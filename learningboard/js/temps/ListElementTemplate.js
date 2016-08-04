define(['temps/Template'], function(Template) {

  var ListElementTemplate = function($template, index) {
    Template.call(this, $template);
    this.index = index;
  }

  ListElementTemplate.prototype.updateIndex = function (index) {
    this.index = index++;
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  $.extend(ListElementTemplate.prototype, Template.prototype);

  return ListElementTemplate;

})