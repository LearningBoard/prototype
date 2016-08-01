define(['activities/ActivityAdapter'], function(ActivityAdapter){
  'use strict';

  var VideoAdapter = function() {
    ActivityAdapter.call(this, 'Video', 'video');
  };

  VideoAdapter.prototype = Object.create(ActivityAdapter.prototype);
  VideoAdapter.prototype.constructor = VideoAdapter;

  VideoAdapter.prototype.renderCustomForm = function() {
    return `
    <div class="form-group">
      <label for="${this.type}_link">Video Link</label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="video link (support YouTube, Vimeo)" pattern=".*(youtube.com|vimeo.com).*" required>
    </div>`;
  };

  VideoAdapter.prototype.renderView = function(modelData) {
    var link = modelData.data.video_link;
    if (link) {
      if(link.match(/watch\?v=(.*)/) != null) {
        link = 'https://www.youtube.com/embed/' + link.match(/watch\?v=(.*)/)[1];
      } else if(link.match(/vimeo\.com\/(.*)/) != null) {
        link = 'https://player.vimeo.com/video/' + link.match(/vimeo\.com\/(.*)/)[1];
      }
    }
    return `
    <div class="row">
      <div class="col-md-12">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
        </div>
      </div>
      <div class="col-md-12">
        <div class="description">${modelData.description}</div>
      </div>
    </div>`;
  };

  return VideoAdapter;
});
