define(['util', 'temps/Template', 'models/Video', 'models/User', 'Timer', 'videojs', 'videojs_offset', 'YouTube', 'Vimeo'], function(util, Template, Video, User, Timer, videojs) {
  "use strict";

  var playbackRates = [2, 1.5, 1.25, 1, 0.5];

  var VideoTemplate = function(video, parentModel, mode) {
    this.parentModel = parentModel; // parent model
    this.mode = mode;
    this.model = new Video(video);
    this.timer = new Timer();

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
    <small>Source: <a href="${this.model.video_link}" target="_blank">${this.model.video_link}</a></small>
    `);

    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)


  VideoTemplate.prototype.display = function() {
    Template.prototype.display.apply(this, arguments);
    var video_tag = this.$template[0];
    var self = this;
    var instance = videojs(video_tag, {
      plugins: {
        offset: {
          start: self.model.video_starttime,
          end: self.model.video_endtime,
          restart_beginning: true
        }
      }
    });
    this.instance = instance;

    instance._analyticsSend = function (action, info) {
      if (self.mode !== util.constant.VIEW_MODE) return false;
      info = info || {};
      var obj = {
        action: action,
        videoCurrentTime: this.currentTime()
      };
      util.propertyExtend(obj, info);
      util.post('/analytics', {
        user: User.getId(),
        lb: self.parentModel.lb,
        activity: self.parentModel.id,
        session: self.parentModel.session,
        data: obj,
        createdAt: new Date()
      });
    };
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
      'ratechange',
      'timeupdate'
    ];

    var gaOnSeeked = util.funcCalledWhenNotActive(function(info, callback) {
      // a "seek" here is counted as a user move the slider and doesn't move it again for 1.5 seconds
      instance._analyticsSend("seek", {
        from: info.seek_from,
        to: info.seek_to,
        timeCost: info.tstamp2 - info.tstamp1, // time cost for seeking
      });
      callback.apply(null, Array.prototype.slice(arguments, 2));
    }, 2500);

    var seeking = false;
    var seek_info = {
      activity: null,
      tstamp1: null,
      tstamp2: null,// time stamps
      seek_from: null,
      seek_to: null, // progress of the video
    }
    var currentRate = instance.playbackRate();
    var paused_time, played_time;
    var timer = this.timer;
    eventList.forEach(function(item) {
      switch (item)
      {
        case "playing": break;
        case "timeupdate": break;
        case "play":
        instance.on(item, function(e) {
          console.log("play");
          currentRate = instance.playbackRate();
          paused_time = timer.measurePause("pause");
          timer.measureStart(currentRate); // play time in playbackRate
          timer.measureStart("play"); // total play time
          console.log(paused_time);
          if (instance.isFullscreen())
            timer.measureStart("fullscreen");
          if (paused_time)
            instance._analyticsSend("play", {totalPausedTime: paused_time});
          else
            instance._analyticsSend("play");
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
          played_time = timer.measurePause("play");
          timer.measurePause("fullscreen");
          if (played_time) instance._analyticsSend("pause", {totalPlayedTime: played_time});
          else instance._analyticsSend("pause");
        });
        break;
        case "ratechange":
        instance.on(item, function(e) {
          timer.measurePause(currentRate);
          var changeFrom = currentRate;
          currentRate = instance.playbackRate();
          if (!instance.paused())
            timer.measureStart(currentRate);
          if (changeFrom)
          {
            console.log("ratechange");
            instance._analyticsSend("ratechange");
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
          console.log("volumechange");
          console.log(e);
        })
        break;
        case "enterfullscreen":
        instance.on(item, function(e) {
          console.log("enterfullscreen");
          timer.measureStart("fullscreen");
          if (instance.paused())
          {
            measurePause("fullscreen");
          }
          console.log("enterfullscreen");
          instance._analyticsSend(e.type);

        })
        break;
        case "exitfullscreen":
        instance.on(item, function(e) {
          console.log("exitfullscreen");
          timer.measurePause("fullscreen");
          instance._analyticsSend(e.type);
        });
        break;
        default:
        instance.on(item, function(e) {
          console.log(item);
          console.log(e);
          console.log(instance);
          instance._analyticsSend(e.type);
        });
      }
    });
  }

  VideoTemplate.prototype.onBeforeUnload = function(e)
  {
    var self = this;
    var timer_result_obj = {
      totalPlayTime: this.timer.measureStop("play"),
      totalPauseTime: this.timer.measureStop("pause")
    };
    var len = playbackRates.length;
    for (var i = 0; i < len; ++i)
    {
      timer_result_obj['totalPlayTimeAt' + playbackRates[i]] = this.timer.measureStop(playbackRates[i]);
    }
    timer_result_obj['totalFullScreenTime'] = this.timer.measureStop("fullscreen");

    this.instance._analyticsSend("view", timer_result_obj);
  };

  VideoTemplate.prototype.replay = function(data)
  {
    switch(data.data.action) {
      case 'play':
        this.instance.currentTime(data.videoCurrentTime);
        this.instance.play();
        break;
      case 'pause':
        this.instance.pause();
        break;
    }
  };

  return VideoTemplate;
});
