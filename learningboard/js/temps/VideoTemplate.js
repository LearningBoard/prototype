define(['util', 'temps/Template', 'models/Video', 'videojs', 'YouTube', 'Vimeo'], function(util, Template, Video, videojs, ytb, vmo) {"use strict";

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
    var eventList = [
      'play', 
      'playing', 
      'pause', 
      'ended', 
      'seeked', 
      'seeking', 
      'volumechange', 
      'enterfullscreen', 
      'exitfullscreen', 
      'captionsenabled', 
      'captionsdisabled',
      // 'timeupate',
    ];
    var $this = this;

    var gaOnSeeked = util.funcCalledWhenNotActive(function(info, callback) {
      // a "seek" here is counted as a user move the slider and doesn't move it again for 1.5 seconds
      console.log(info);
      console.log("seeked");
      __ga__('send', {
        hitType: 'event',
        eventCategory: 'Activity_video',
        eventAction: 'seek',
        eventLabel: info.activity.id + ":" + info.activity.title,
        eventValue: info.tstamp1 - info.tstamp2, // time cost for seeking
        dimention1: info.seek_from,
        dimention2: info.seek_to,
      });
      callback.apply(null, Array.prototype.slice(arguments, 2));
    }, 1500);

    var seeking = false;
    var seek_info = {
      activity: null,
      tstamp1: null,
      tstamp2: null,// time stamps
      seek_from: null, 
      seek_to: null, // time of the video
    }
    eventList.forEach(function(item) {
      switch (item)
      {
        case "seeking":
        instance.on(item, function(e) {
          if (!seeking)
          {
            console.log("seeking");
            // log useful data
            // send when seeked
            seeking = true;
            seek_info.tstamp1 = new Date();
            seek_info.seek_from = instance.currentTime();
          }
        });
        break;
        case "seeked":
        instance.on(item, function(e) {
          seek_info.tstamp2 = new Date();
          seek_info.seek_to = instance.currentTime();
          seek_info.activity = $this.parent;
          // will log the seek behavior in ga 
          // if the user don't seek again in 2 seconds
          gaOnSeeked(seek_info, function() {
            seeking = false; // seeking stops
          });
        });
        break;
        default:
        instance.on(item, function(e) {
          console.log(e);
          console.log(instance);
          __ga__('send', {
            hitType: 'event',
            eventCategory: `Activity_${$this.parent.type}`,
            eventAction: e.type,
            eventLabel: "id "+$this.parent.id+": "+$this.parent.title,
            eventValue: 1
          });
        });
      }
    });       
  }

  return VideoTemplate;
});
