define(['../ActivityFormTemplate', 'moment'], function(ActivityFormTemplate, moment){
  'use strict';

  var VideoFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Video', 'video');

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
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="${this.type}_endtime">Video End Time</label>
          <input type="text" class="form-control" id="${this.type}_endtime" name="${this.type}_endtime" placeholder="00:00:00">
        </div>
      </div>
    </div>
    `;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(VideoFormTemplate.prototype, ActivityFormTemplate.prototype);

  VideoFormTemplate.prototype.isFormDataValid = function() {
    var valid = ActivityFormTemplate.prototype.isFormDataValid.call(this);
    if (!valid) return false;
    var startEle = this.$template.find(`[name=${this.type}_starttime]`);
    var endEle = this.$template.find(`[name=${this.type}_endtime]`);
    var start = moment.duration(startEle.val());
    var end = moment.duration(endEle.val());
    var pattern = /^\d{2}:[0-5][0-9]:[0-5][0-9]$/;
    if (!pattern.test(startEle.val()) || !pattern.test(endEle.val()) || end.subtract(start).asSeconds() < 0) {
      startEle.focus();
      alert('Video time format should be HH:MM:SS');
      return false;
    }
    return true;
  };

  VideoFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    if (obj.video_starttime == obj.video_endtime) {
      delete obj.video_starttime;
      delete obj.video_endtime;
    }
    return obj;
  };

  return VideoFormTemplate;
});
