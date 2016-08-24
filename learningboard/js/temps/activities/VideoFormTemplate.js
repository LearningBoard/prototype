define(['../ActivityFormTemplate'], function(ActivityFormTemplate){
  'use strict';

  var VideoFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Video', 'video');

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Video Link</label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="video link (support YouTube, Vimeo)" pattern=".*(youtube.com|vimeo.com).*" required>
    </div>
    <div class="form-group">
      <label>Video Time</label>
      <div class="row">
        <div class="col-xs-6">
          <input type="text" class="form-control" id="${this.type}_starttime" name="${this.type}_starttime" placeholder="00:00">
        </div>
        <div class="col-xs-6">
          <input type="text" class="form-control" id="${this.type}_endtime" name="${this.type}_endtime" placeholder="00:00">
        </div>
      </div>
    </div>
    `;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(VideoFormTemplate.prototype, ActivityFormTemplate.prototype);
  return VideoFormTemplate;
});
