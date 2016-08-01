define(['temps/Template', 'mdls/Text'], function(Template, Text) {
  "use strict";

  var TextTemplate = function(text) {

    this.model = new Text(text);

    var link = this.model.text_image;
    if (!link) {link = "img/placeholser-no-image.png"}
    $html = $(`
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
      </div>
    `);
  }

  $.extend(TextTemplate.prototype, Template.prototype)
});
