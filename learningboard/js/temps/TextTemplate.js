define(['temps/Template', 'mdls/Text'], function(Template, Text) {
  "use strict";

  var TextTemplate = function(text) {

    this.model = new Text(text);

    var link = this.model.text_image;
    if (link === '') link = "img/placeholder-no-image.png";

    var $html = $(`
      <img src="${link}" class="img-responsive" />
    `);

    Template.call(this, $html);
  }

  $.extend(TextTemplate.prototype, Template.prototype)

  return TextTemplate;
});
