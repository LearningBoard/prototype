define(['temps/Template', 'models/Video', 'plyr'], function(Template, Video, plyr) {
  "use strict";

  var VideoTemplate = function(video, parent) {

    this.parent = parent;
    this.model = new Video(video);
    var $this = this;

    var $html = $(`<div><div class="js-player" data-type="${this.model.video_type}" data-video-id="${this.model.video_id}"></div></div>`);
    var video_tag = $html[0];

    var instance = plyr.setup(video_tag);
    var player = instance[0].plyr;
    $html.on('play playing pause ended seeked seeking volumechange enterfullscreen exitfullscreen captionsenabled captionsdisabled', function(e) {
      __ga__('send', {
        hitType: 'event',
        eventCategory: `Activity_${$this.parent.type}`,
        eventAction: e.type,
        eventLabel: $this.parent.title,
        eventValue: $this.parent.id
      });
    });

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  return VideoTemplate;
});
