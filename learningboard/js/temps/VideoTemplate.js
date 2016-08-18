define(['temps/Template', 'models/Video', 'videojs', 'YouTube', 'Vimeo'], function(Template, Video, videojs, ytb, vmo) {"use strict";

  var VideoTemplate = function(video, parent) {

    this.parent = parent;
    this.model = new Video(video);

    var setupObj = {
      techOrder: this.model.video_techOrder, 
      sources: [
        { 
          type: "video/"+this.model.video_type,
          src: this.model.video_link
        }
      ] 
    }
    $.extend(setupObj, this.model.video_sup);

    var $html = $(`
    <video
      id="vid1"
      class="video-js vjs-default-skin ${this.model.video_type === "youtube"? "vjs-16-9": ""}"
      controls 
      data-setup=${JSON.stringify(setupObj)}
    >
    </video>
    `);
    console.log($html[0]);

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  VideoTemplate.prototype.display = function() {
    Template.prototype.display.apply(this, arguments);
    var video_tag = this.$template[0];
    var instance = videojs(video_tag);
    var eventList = ['play', 'playing', 'pause', 'ended', 'seeked', 'seeking', 'volumechange', 'enterfullscreen', 'exitfullscreen', 'captionsenabled', 'captionsdisabled']
    var $this = this;
    eventList.forEach(function(item) {
      instance.on(item, function(e) {
        __ga__('send', {
          hitType: 'event',
          eventCategory: `Activity_${$this.parent.type}`,
          eventAction: e.type,
          eventLabel: $this.parent.title,
          eventValue: $this.parent.id
        });
      });
    });
  }

  return VideoTemplate;
});
