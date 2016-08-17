define(['temps/Template', 'models/Video', 'plyr'], function(Template, Video, plyr) {
  "use strict";


  var VideoTemplate = function(video) {

    this.model = new Video(video);

    var $html = $(`
      <div>
        <div class="js-player" data-type="${this.model.video_type}" data-video-id="${this.model.video_id}" controls> </div>
      </div>`);
    var video_tag = $html[0];

    var options = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen'],
      debug: true
    };

    var instance = plyr.setup(video_tag, options);
    var player = instance[0].plyr;
    player.play();

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  return VideoTemplate;
});
