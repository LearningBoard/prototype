define(['../ActivityFormTemplate'], function(ActivityFormTemplate){
  'use strict';

  var VideoFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Video', 'video');

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Video Link</label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="video link (support YouTube, Vimeo)" pattern=".*(youtube.com|vimeo.com).*" required>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(VideoFormTemplate.prototype, ActivityFormTemplate.prototype);
  return VideoFormTemplate;
});
