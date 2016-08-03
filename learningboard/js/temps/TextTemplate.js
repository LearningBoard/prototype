define(['util', 'temps/Template', 'mdls/Text'], function(util, Template, Text) {
  "use strict";

  var TextTemplate = function(text) {

    this.model = new Text(text);

    var link = this.model.text_image;
    if (link === '') link = "img/placeholder-no-image.png";
    else link = util.media_addr + '/' + link;

    var $html = $(`
      <img src="${link}" class="img-responsive" />
    `);

    Template.call(this, $html);
  }

  $.extend(TextTemplate.prototype, Template.prototype)

  return TextTemplate;
});
