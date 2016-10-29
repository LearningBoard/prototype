define(['util', 'config', '../ActivityFormTemplate', 'models/Video', 'moment'], function(util, config, ActivityFormTemplate, Video, moment){
  'use strict';

  var VideoFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Video', 'video');

    var thisArg = this;

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Video Link<span class="text-danger">*</span></label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="video link (support YouTube, Vimeo, .mp4)" pattern=".*(youtube.com.*|vimeo.com.*|(.mp4$))" required>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <div class="form-group">
          <label for="${this.type}_starttime">Video Start Time</label>
          <input type="text" class="form-control" id="${this.type}_starttime" name="${this.type}_starttime" placeholder="00:00:00">
          <span class="help-block"></span>
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="${this.type}_endtime">Video End Time</label>
          <input type="text" class="form-control" id="${this.type}_endtime" name="${this.type}_endtime" placeholder="00:00:00">
          <span class="help-block"></span>
        </div>
      </div>
    </div>
    `;
    this.$template.find('.customForm').append(customFormHtml);

    var changeVideoTimePlaceholder = util.funcCalledWhenNotActive(function(link) {
      var video = new Video({video_link: link});
      switch (video.video_type) {
        case 'youtube':
          $.get(`https://www.googleapis.com/youtube/v3/videos?id=${video.video_id}&part=contentDetails&key=${config.youtube.apiKey}`,
            function(res)
            {
              if (res.items.length > 0) {
                var duration = moment.duration(res.items[0].contentDetails.duration, moment.ISO_8601);
                thisArg.$template.find('[name=video_endtime]').attr('placeholder', thisArg.momentObjToDuration(duration));
              } else {
                thisArg.$template.find('[name=video_endtime]').attr('placeholder', '00:00:00');
              }
            }
          ).fail(function () {
            thisArg.$template.find('[name=video_endtime]').attr('placeholder', '00:00:00');
          });
          break;
        case 'vimeo':
          $.get(`https://vimeo.com/api/oembed.json?url=${video.video_link}`,
            function(res)
            {
              var duration = moment.duration(parseInt(res.duration), 'seconds');
              thisArg.$template.find('[name=video_endtime]').attr('placeholder', thisArg.momentObjToDuration(duration));
            }
          ).fail(function () {
            thisArg.$template.find('[name=video_endtime]').attr('placeholder', '00:00:00');
          });
          break;
        case 'mp4':
          var tempVideo = $(`
            <video preload="metadata" muted class="hidden">
              <source src="${video.video_link}" type="video/mp4">
            </video>`
          );
          thisArg.$template.prepend(tempVideo);
          thisArg.$template.find(tempVideo).one('loadedmetadata', function() {
            var duration = moment.duration(parseInt($(this)[0].duration), 'seconds');
            thisArg.$template.find('[name=video_endtime]').attr('placeholder', thisArg.momentObjToDuration(duration));
            $(this).remove();
          });
          break;
        default:
          thisArg.$template.find('[name=video_endtime]').attr('placeholder', '00:00:00');
      }
    }, 1000);

    this.$template.find('[name=video_link]').on('keyup', function() {
      // Auto fill in start time & end time
      var currentStart = thisArg.$template.find('[name=video_starttime]');
      var currentEnd = thisArg.$template.find('[name=video_endtime]');
      var matchStart = $(this).val().match(/(start|t)=(\d+)/);
      var matchEnd = $(this).val().match(/end=(\d+)/);
      if (matchStart) {
        var duration = moment.duration(parseInt(matchStart[2]), 'seconds');
        currentStart.val(thisArg.momentObjToDuration(duration));
      }
      if (matchEnd) {
        var duration = moment.duration(parseInt(matchEnd[1]), 'seconds');
        currentEnd.val(thisArg.momentObjToDuration(duration));
      }
      // Auto change end time placeholder to actual video duration
      changeVideoTimePlaceholder(thisArg.$template.find('[name=video_link]').val());
    });
  };

  $.extend(VideoFormTemplate.prototype, ActivityFormTemplate.prototype);

  VideoFormTemplate.prototype.reset = function() {
    ActivityFormTemplate.prototype.reset.call(this);
    this.$template.find('[name=video_endtime]').attr('placeholder', '00:00:00');
  };

  VideoFormTemplate.prototype.setData = function(act) {
    ActivityFormTemplate.prototype.setData.call(this, act);

    var startEle = this.$template.find(`[name=${this.type}_starttime]`);
    var endEle = this.$template.find(`[name=${this.type}_endtime]`);
    var duration = moment.duration(parseInt(act.data[`${this.type}_endtime`]), 'seconds');
    endEle.val(this.momentObjToDuration(duration));
    duration = moment.duration(parseInt(act.data[`${this.type}_starttime`]), 'seconds');
    startEle.val(this.momentObjToDuration(duration));

    this.$template.find('[name=video_link]').trigger('keyup');
  };

  VideoFormTemplate.prototype.isFormDataValid = function() {
    var startEle = this.$template.find(`[name=${this.type}_starttime]`);
    var endEle = this.$template.find(`[name=${this.type}_endtime]`);
    // Clear old label
    startEle.parent('div').removeClass('has-warning');
    startEle.siblings('.help-block').text('');
    endEle.parent('div').removeClass('has-warning');
    endEle.siblings('.help-block').text('');
    // Start checking
    var start = moment.duration(startEle.val());
    var end = moment.duration(endEle.val());
    var total = moment.duration(endEle.attr('placeholder'));
    var pattern = /^(\d{2,}:[0-5][0-9]:[0-5][0-9])?$/;
    if (!pattern.test(startEle.val()) || !pattern.test(endEle.val())) {
      startEle.focus();
      startEle.parent('div').addClass('has-warning');
      startEle.siblings('.help-block').text('Video time format should be HH:MM:SS');
      endEle.parent('div').addClass('has-warning');
      endEle.siblings('.help-block').text('Video time format should be HH:MM:SS');
      return false;
    } else if (total.asSeconds() && start.subtract(total).asSeconds() > 0) {
      startEle.focus();
      startEle.parent('div').addClass('has-warning');
      startEle.siblings('.help-block').text(`Video starting time exceed the video length (${endEle.attr('placeholder')})`);
      return false;
    } else if (total.asSeconds() && end.subtract(total).asSeconds() > 0) {
      endEle.focus();
      endEle.parent('div').addClass('has-warning');
      endEle.siblings('.help-block').text(`Video ending time exceed the video length (${endEle.attr('placeholder')})`);
      return false;
    } else if (end.subtract(start).asSeconds() < 0) {
      endEle.focus();
      endEle.parent('div').addClass('has-warning');
      endEle.siblings('.help-block').text('Video ending time must be larger than starting time');
      return false;
    }
    return true;
  };

  VideoFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    obj.video_starttime = moment.duration(obj.video_starttime).asSeconds();
    obj.video_endtime = moment.duration(obj.video_endtime).asSeconds();
    if ((!obj.video_starttime && !obj.video_endtime) || obj.video_starttime == obj.video_endtime) {
      delete obj.video_starttime;
      delete obj.video_endtime;
    }
    return obj;
  };

  VideoFormTemplate.prototype.momentObjToDuration = function(obj) {
    if (obj.asSeconds()) {
      return $.padNumber(obj.hours(), 2) + ':' + $.padNumber(obj.minutes(), 2) + ':' + $.padNumber(obj.seconds(), 2);
    } else {
      return '';
    }
  };

  return VideoFormTemplate;
});
