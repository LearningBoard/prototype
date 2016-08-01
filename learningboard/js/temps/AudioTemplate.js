define(['temps/Template', 'models/Audio'], function(Template, Audio) {
  "use strict";

  var AudioTemplate = function(audio) {
    this.model = new Audio(audio);
    var link = this.model.audio_link;

    var $html = $(`
      <div class="embed-responsive embed-responsive-16by9">
        Audio has not been finished yet.
      </div>
    `);
    Template.call(this, $html);
  };

  $.extend(AudioTemplate.prototype, Template.prototype);

  return AudioTemplate;

})