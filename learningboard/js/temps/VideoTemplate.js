define(['temps/Template', 'models/Video'], function(Template, Video) {
  "use strict";

  var VideoTemplate = function(video) {

    this.model = new Video(video);

    var link = this.model.video_link;
    if (link) {
      if(link.match(/watch\?v=(.*)/) != null) {
        link = 'https://www.youtube.com/embed/' + link.match(/watch\?v=(.*)/)[1];
      } else if(link.match(/vimeo\.com\/(.*)/) != null) {
        link = 'https://player.vimeo.com/video/' + link.match(/vimeo\.com\/(.*)/)[1];
      }
    }
    var $html = $(`
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
      </div>
    `);
    Template.call(this, $html);
  }

  $.extend(VideoTemplate.prototype, Template.prototype)

  return VideoTemplate;
});
