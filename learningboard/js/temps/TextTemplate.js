define(['util', 'temps/Template', 'mdls/Text'], function(util, Template, Text) {
  "use strict";

  var TextTemplate = function(text, parentModel) {
    this.parentModel = parentModel;
    this.model = new Text(text);

    var link;
    if (this.model.text_image === '') link = "img/placeholder-no-image.png";
    else link = util.urls.media_addr+'/'+this.model.text_image;

    var $html = '';
    if (this.model.text_image) {
      $html = $(`
        <div class="clearfix">
          <img src="${link}" class="img-responsive pull-left" />
        </div>
      `);
    }

    Template.call(this, $html);
  }

  $.extend(TextTemplate.prototype, Template.prototype)

  return TextTemplate;
});
