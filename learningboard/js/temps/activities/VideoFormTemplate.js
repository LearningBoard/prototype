define(['../ActivityFormTemplate', 'moment'], function(ActivityFormTemplate, moment){
  'use strict';

  var VideoFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Video', 'video');

    var thisArg = this;

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Video Link</label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="video link (support YouTube, Vimeo)" pattern=".*(youtube.com|vimeo.com).*" required>
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

    this.$template.find('[name=video_link]').on('keyup', function() {
      var currentStart = thisArg.$template.find('[name=video_starttime]');
      var currentEnd = thisArg.$template.find('[name=video_endtime]');
      var matchStart = $(this).val().match(/(start|t)=(\d+)/);
      var matchEnd = $(this).val().match(/end=(\d+)/);
      if (matchStart) {
        var duration = moment.duration(parseInt(matchStart[2]), 'seconds');
        currentStart.val($.padNumber(duration.hours(), 2) + ':' + $.padNumber(duration.minutes(), 2) + ':' + $.padNumber(duration.seconds(), 2));
      }
      if (matchEnd) {
        var duration = moment.duration(parseInt(matchEnd[1]), 'seconds');
        currentEnd.val($.padNumber(duration.hours(), 2) + ':' + $.padNumber(duration.minutes(), 2) + ':' + $.padNumber(duration.seconds(), 2));
      }
    });
  };

  $.extend(VideoFormTemplate.prototype, ActivityFormTemplate.prototype);

  VideoFormTemplate.prototype.setData = function(act) {
    ActivityFormTemplate.prototype.setData.call(this, act);

    var startEle = this.$template.find(`[name=${this.type}_starttime]`);
    var endEle = this.$template.find(`[name=${this.type}_endtime]`);
    var duration = moment.duration(parseInt(act.data[`${this.type}_endtime`]), 'seconds');
    endEle.val(duration.asSeconds() ? $.padNumber(duration.hours(), 2) + ':' + $.padNumber(duration.minutes(), 2) + ':' + $.padNumber(duration.seconds(), 2) : '');
    duration = moment.duration(parseInt(act.data[`${this.type}_starttime`]), 'seconds');
    startEle.val(duration.asSeconds() || endEle.val() ? $.padNumber(duration.hours(), 2) + ':' + $.padNumber(duration.minutes(), 2) + ':' + $.padNumber(duration.seconds(), 2) : '');
  };

  VideoFormTemplate.prototype.isFormDataValid = function() {
    var startEle = this.$template.find(`[name=${this.type}_starttime]`);
    var endEle = this.$template.find(`[name=${this.type}_endtime]`);
    startEle.parent('div').removeClass('has-warning');
    startEle.siblings('.help-block').text('');
    endEle.parent('div').removeClass('has-warning');
    endEle.siblings('.help-block').text('');
    var start = moment.duration(startEle.val());
    var end = moment.duration(endEle.val());
    var pattern = /^(\d{2,}:[0-5][0-9]:[0-5][0-9])?$/;
    if (!pattern.test(startEle.val()) || !pattern.test(endEle.val())) {
      startEle.focus();
      startEle.parent('div').addClass('has-warning');
      startEle.siblings('.help-block').text('Video time format should be HH:MM:SS');
      endEle.parent('div').addClass('has-warning');
      endEle.siblings('.help-block').text('Video time format should be HH:MM:SS');
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

  return VideoFormTemplate;
});
