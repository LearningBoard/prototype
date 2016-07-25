define(function() {
  var Activity = function(activity)
  {
    $.extend(this, activity);
    switch (this.type)
    {
      case "video":
      var video_link = this.data.video_link;
      if(video_link)
      {
        if(video_link.match(/watch\?v=(.*)/) != null)
        {
          this.video_link = 'https://www.youtube.com/embed/' 
          + video_link.match(/watch\?v=(.*)/)[1];
        }
        else if(video_link.match(/vimeo\.com\/(.*)/) != null)
        {
          this.video_link = 'https://player.vimeo.com/video/' 
          + video_link.match(/vimeo\.com\/(.*)/)[1];
        }
      }
    }
  };

  Activity.prototype = {
    published: function()
    {
      return this.publish === true;
    }
  };

  return Activity;
  
});
