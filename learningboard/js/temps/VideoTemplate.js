define(['temps/Template', 'models/Video', 'plyr', 'ga'], function(Template, Video, plyr, ga) {
  "use strict";

  var VideoTemplate = function(video, parent) {

    this.parent = parent;
    var $this = this;
    this.model = new Video(video);

    var $html = $(`<div><div class="js-player" data-type="${this.model.video_type}" data-video-id="${this.model.video_id}"></div></div>`);
    var video_tag = $html[0];

    var instance = plyr.setup(video_tag);
    var player = instance[0].plyr;
    $html.on('play playing pause ended seeked seeking volumechange enterfullscreen exitfullscreen captionsenabled captionsdisabled', function(e) {
      ga('send', 'event', 'Activity_video', e.type, $this.model.video_link);
    });

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  return VideoTemplate;
});
