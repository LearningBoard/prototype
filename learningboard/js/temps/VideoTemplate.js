define(['util', 'temps/Template', 'models/Video', 'models/User', 'videojs', 'Timer', 'YouTube', 'Vimeo', 'md5'], function(util, Template, Video, User, videojs, Timer, ytb, vmo, md5) {"use strict";

  var playbackRates = [ 2, 1.5, 1.25, 1, 0.5];
  var parentId, cliendId, authorId;

  var VideoTemplate = function(video, parentModel) {
    console.log(util.uuid());

    parentId = parentModel.id;
    authorId = parentModel.author.id;
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
    util.propertyExtend(setupObj, this.model.video_sup);

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


  VideoTemplate.prototype.display = function() {
    Template.prototype.display.apply(this, arguments);
    var video_tag = this.$template[0];
    var instance = videojs(video_tag);
    this.instance = instance;
    instance.__gaSend = function (action, info) {
      info = info || {};
      var obj = {
        hitType: 'event',
        eventCategory: `Activity_video`,
        eventAction: action,
        eventLabel: util.uuid(),
        eventValue: parseInt(this.currentTime()),
        userId: User.getId(),
        dimension1: parentId,
        dimension2: authorId,
        dimension3: User.getId()
      }

      util.propertyExtend(obj, info);

      __ga__('send', obj);
    }
    var eventList = [
      // 'timeupate',
      // 'loadmetadata',
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
      instance.__gaSend("seek", {
        metric1: info.seek_from,
        metric2: info.seek_to,
        metric10: info.tstamp2 - info.tstamp1, // time cost for seeking
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
    var currentRate = instance.playbackRate();
    var timer = this.timer;
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
          if (instance.isFullscreen())
            timer.measureStart("fullscreen");
        });
        break;
        case "stalled":
        instance.on(item, function(e) {
          console.log("stalled");
        })
        case "pause":
        instance.on(item, function(e) {
          console.log("paused");
          timer.measurePause(currentRate);
          timer.measureStart("pause");
          timer.measurePause("play");
          timer.measurePause("fullscreen");
          instance.__gaSend("pause");
        });
        break;
        case "ratechange":
        instance.on(item, function(e) {
          console.log("ratechange");
          timer.measurePause(currentRate);
          var changeFrom = currentRate;
          console.log(changeFrom);
          currentRate = instance.playbackRate();
          if (!instance.paused())
            timer.measureStart(currentRate);
          if (changeFrom)
          {
            console.log("sending ratechange");
            instance.__gaSend("ratechange");
          }
          else currentRate = undefined;
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
          instance.__gaSend(e.type);

        })
        break;
        case "exitfullscreen":
        instance.on(item, function(e) {
          timer.measurePause("fullscreen");
          instance.__gaSend(e.type);
        });
        break;
        default:
        instance.on(item, function(e) {
          console.log(e);
          console.log(instance);
          instance.__gaSend(e.type);
        });
      }
    });       
  }

  VideoTemplate.prototype.onBeforeUnload = function(e) 
  {
    var self = this;
    var timer_result_obj = {
      metric11: self.timer.measureStop("play")
    };
    var len = playbackRates.length;
    timer_result_obj['metric3'] = this.timer.measureStop("pause");
    for (var i = 0; i < len; ++i)
    {
      timer_result_obj["metric"+(8-i)] = this.timer.measureStop(playbackRates[i]);
      console.log(8-i);
      console.log(timer_result_obj["metric"+(8-i)]);
    }
    console.log(timer_result_obj);
    console.log(timer_result_obj["metric4"]);
    timer_result_obj['metric9'] = this.timer.measureStop("fullscreen");

    console.log("haha unload");
    this.instance.__gaSend("view", timer_result_obj);
  }

  return VideoTemplate;
});
