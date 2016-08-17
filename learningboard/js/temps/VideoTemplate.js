define(['temps/Template', 'models/Video', 'videojs', 'ga', 'YouTube'], function(Template, Video, videojs, ga, ytb) {
  "use strict";

  var VideoTemplate = function(video, parent) {

    this.parent = parent;
    var $this = this;
    this.model = new Video(video);

    var $html = $(`
    <video
      id="vid1"
      class="video-js vjs-default-skin"
      controls
      autoplay
      width="640" height="264"
      data-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "https://www.youtube.com/watch?v=xjS6SftYQaQ"}] }'
    >
    </video>
    `);
    var video_tag = $html[0];
    instance = videojs(video_tag);
    var eventList = ['play', 'playing', 'pause', 'ended', 'seeked', 'seeking', 'volumechange', 'enterfullscreen', 'exitfullscreen', 'captionsenabled', 'captionsdisabled']
    eventList.forEach(function(item) {
      instance.on(item, function() {
        ga('send', 'event', 'Activity_video', e.type, $this.model.video_link);
      })
    })

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  return VideoTemplate;
});
