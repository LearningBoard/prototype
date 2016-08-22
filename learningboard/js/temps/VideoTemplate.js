define(['util', 'temps/Template', 'models/Video', 'videojs', 'Timer', 'YouTube', 'Vimeo'], function(util, Template, Video, videojs, Timer, ytb, vmo) {"use strict";

  var playbackRates = [ 2, 1.5, 1.25, 1, 0.5];

  var VideoTemplate = function(video, parentModel) {

    this.parentModel = parentModel; // parent model
    this.model = new Video(video);
    this.timer = new Timer();
    console.log(this.timer);

    var setupObj = {
      techOrder: this.model.video_techOrder, 
      playbackRates: playbackRates,
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
      id="vid${this.parentModel.id}"
      class="video-js vjs-default-skin ${this.model.video_type === "youtube"? "vjs-16-9": ""}"
      preload="auto"
      controls
      data-setup=${JSON.stringify(setupObj)}
    >
    </video>
    `);
    console.log($html[0]);

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  function gaCount (event, model) {
    __ga__('send', {
      hitType: 'event',
      eventCategory: `Activity_${model.type}`,
      eventAction: event.type,
      eventLabel: "id "+model.id+": "+model.title,
      eventValue: 1
    });
  }

  VideoTemplate.prototype.display = function() {
    Template.prototype.display.apply(this, arguments);
    var video_tag = this.$template[0];
    var instance = videojs(video_tag);
    console.log(instance);

    var eventList = [
      // 'timeupate',
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
      'ratechange'
    ];
    var self = this;

    var gaOnSeeked = util.funcCalledWhenNotActive(function(info, callback) {
      // a "seek" here is counted as a user move the slider and doesn't move it again for 1.5 seconds
      console.log(info);
      console.log("seeked");
      __ga__('send', {
        hitType: 'event',
        eventCategory: 'Activity_video',
        eventAction: 'seek',
        eventLabel: info.activity.id + ":" + info.activity.title,
        eventValue: info.tstamp2 - info.tstamp1, // time cost for seeking
        metric1: info.seek_from,
        metric2: info.seek_to,
      });
      callback.apply(null, Array.prototype.slice(arguments, 2));
    }, 1500);

    var seeking = false;
    var seek_info = {
      activity: null,
      tstamp1: null,
      tstamp2: null,// time stamps
      seek_from: null, 
      seek_to: null, // progress of the video
    }
    var currentRate;
    var timer = this.timer;
    console.log(instance);
    eventList.forEach(function(item) {
      switch (item)
      {
        case "playing": 
        instance.on(item, function(e) {
          console.log("playing");
          currentRate = instance.playbackRate();
          timer.measurePause("pause");
          timer.measureStart(currentRate); // play time in playbackRate
          timer.measureStart("play"); // total play time
          if (instance.isFullScreen())
            timer.measureStart("fullscreen");
        });
        break;
        case "pause":
        instance.on(item, function(e) {
          console.log("paused");
          timer.measurePause(currentRate);
          timer.measureStart("pause");
          timer.measurePause("play");
          timer.measurePause("fullscreen");
        });
        break;
        case "ratechange":
        instance.on(item, function(e) {
          console.log("rate changed");
          timer.measurePause(currentRate);
          currentRate = instance.playbackRate();
          timer.measureStart(currentRate);
        }); 
        break;
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
          seek_info.activity = self.parent;
          // will log the seek behavior in ga 
          // if the user don't seek again in 2 seconds
          gaOnSeeked(seek_info, function() {
            seeking = false; // seeking stops
          });
        });
        break;
        case "volumechange":
        instance.on(item, function(e) {
          console.log(e);
        })
        break;
        case "enterfullscreen":
        instance.on(item, function(e) {
          timer.measureStart("fullscreen");
          if (instance.paused())
          {
            measurePause("fullscreen");
          }
          console.log("enterfullscreen");
          gaCount(e, this.parentModel);

        })
        break;
        case "exitfullscreen":
        instance.on(item, function(e) {
          timer.measurePause("fullscreen");
          gaCount(e, this.parentModel);
        })
        break;
        default:
        instance.on(item, function(e) {
          console.log(e);
          console.log(instance);
          gaCount(e, this.parentModel);
        });
      }
    });       
  }

  VideoTemplate.prototype.onBeforeUnload = function(e) 
  {
    var self = this;
    var timer_result_obj = {
      hitType: 'event',
      eventCategory: 'Activity_video',
      eventAction: "view",
      eventLabel: "id "+self.parentModel.id+": "+self.parentModel.title,
      eventValue: self.timer.measureStop("play")
    };
    var len = playbackRates.length;
    timer_result_obj['metric3'] = this.timer.measureStop("pause");
    for (var i = 0; i < length; ++i)
      timer_result_obj["metric"+(8-i)] = this.timer.measureStop(playbackRates[i]);
    timer_result_obj['metric9'] = this.timer.measureStop("fullscreen");

    console.log("haha unload");
    console.log(this.timer._.measures[1]);
    __ga__('send', timer_result_obj);
  }

  return VideoTemplate;
});
