define(['util'], function (util) {
  "use strict";
  
  var Video = function(video)
  {
    $.extend(this, video);

    if (typeof video.video_starttime === 'string')
    {
      this.video_starttime = util.toSecond(video.video_starttime);
    }
    if (typeof video.video_endtime === 'string')
    {
      this.video_endtime = util.toSecond(video.video_endtime);
    }

    var link = this.video_link;
    if (link) {
      if(link.match(/watch\?v=(.*)/) != null) {
        this.video_id = link.match(/watch\?v=(.*)/)[1];
        this.video_type = "youtube";
        this.video_techOrder = ["youtube"];
        this.video_sup = {
          youtube: {
            disablekb: 1, 
            cc_load_policy: 0, 
          }
        };
      } 
      else if(link.match(/vimeo\.com\/(\d+)/) != null) 
      {
        this.video_id = link.match(/vimeo\.com\/(\d+)/)[1];
        this.video_type = "vimeo";
        this.video_techOrder = ["vimeo"];
        this.video_sup = {
          vimeo: {iv_load_policy: 1}
        };
      }
    }
  };

  return Video;

});
