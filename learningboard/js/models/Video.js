define(function () {
  "use strict";
  
  var Video = function(video)
  {
    $.extend(this, video);

    var link = this.video_link;
    if (link) {
      if(link.match(/watch\?v=(.*)/) != null) {
        this.video_id = link.match(/watch\?v=(.*)/)[1];
        this.video_type = "youtube";
      } else if(link.match(/vimeo\.com\/(.*)/) != null) {
        this.video_id = link.match(/vimeo\.com\/(\d+)/)[1];
        this.video_type = "vimeo";
      }
    }
    console.log(this.video_id);
  };

  return Video;

})
