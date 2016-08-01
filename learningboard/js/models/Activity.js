define(function() {
  var Activity = function(activity)
  {
    $.extend(this, activity);
    
    /*
    switch (this.type)
    {
      case "video":
      var video_link = this.data.video_link;
      if(video_link)
      {
        if(video_link.match(/watch\?v=(.*)/) != null)
        {
          this.src_link = 'https://www.youtube.com/embed/' 
          + video_link.match(/watch\?v=(.*)/)[1];
        }
        else if(video_link.match(/vimeo\.com\/(.*)/) != null)
        {
          this.src_link = 'https://player.vimeo.com/video/' 
          + video_link.match(/vimeo\.com\/(.*)/)[1];
        }
      }
      break;

      case "text":
      this.src_link = this.data.text_image;

      case "folder":
      var folder_link = this.data.folder_link;
      if(folder_link){
        if(folder_link.match(/drive\.google\.com/) !== null)
        {
          var emb = 'https://drive.google.com/embeddedfolderview?id=';
          if (folder_link.match(/id=(.*)/) !== null)
          {
            this.src_link = emb 
            + folder_link.match(/id=(.*)/)[1] + '#list';
          }
          else if (folder_link.match(/\/folders\//) !== null)
          {
            this.src_link = emb 
            + folder_link.match(/\/folders\/(.*)/)[1] + '#list';
          }
        }
      }
      break;

      case "code":
      var code_link = this.data.code_link;

      // handle different links
      if(code_link){
        if(code_link.match(/jsfiddle\.net/) != null){
          this.src_link = code_link + 'embedded/';
        }else if(code_link.match(/plnkr\.co/) != null){
          this.src_link = 'https://embed.plnkr.co/' 
          + code_link.replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
        }
      }
    }
    */
  };

  Activity.prototype = {
    published: function()
    {
      return this.publish === true;
    }
  };

  return Activity;
  
});
