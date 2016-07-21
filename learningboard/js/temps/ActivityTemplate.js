define(['temps/Activity', 'temps/Template'], function(Activity, Template) {

  function ActivityTemplate(activity, index)
  {
    // index: for the order of display
    // inherits Activity and Template

    Activity.call(this, activity);
    this.index = ++index;
    this.render();
  };

  ActivityTemplate.prototype.render = function(activity)
  {
    if(activity){
      this.activity = activity;
    }
    var html;
    var activityControl;

    if(localStorage.is_staff && location.href.includes('board_edit.html')){
      activityControl = `
      <div class="control" data-id="${this.activity.id}">
        <ul>
          <li ${this.activity['status'] == 0 ? 'class="hidden"' : ''}><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></li>
          <li ${this.activity['status'] == 0 ? '' : 'class="hidden"'}><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span></li>
          <li><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></li>
          <li><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>
        </ul>
      </div>`;
    }else{
      activityControl = `
      <div class="control" data-id="${this.activity.id}">
        <ul class="text-muted">
          <li><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Re Add</li>
          <li><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share</li>
          <li class="markAsComplete"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Mark as complete</li>
        </ul>
      </div>`;
    }
    try
    {
      $.extend(this.activity, JSON.parse(this.activity.data));
    }
    catch (err)
    {
      console.log(err);
      console.log(this);
    }
    switch(this.activity['type']){
      case 'video':
        // handle different links
        if(this.activity['video_link']){
          if(this.activity['video_link'].match(/watch\?v=(.*)/) != null){
            this.activity['video_link'] = 'https://www.youtube.com/embed/' + this.activity['video_link'].match(/watch\?v=(.*)/)[1];
          }else if(this.activity['video_link'].match(/vimeo\.com\/(.*)/) != null){
            this.activity['video_link'] = 'https://player.vimeo.com/video/' + this.activity['video_link'].match(/vimeo\.com\/(.*)/)[1];
          }
        }
        html = `
        <div class="activity ${this.published() ? '' : 'unpublish'}">
          <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
          <p class="title lead">${this.activity['title']}</p>
          <p class="text-muted">
            Posted date: ${new Date(this.activity['post_time']).toDateString()}
            Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
          </p>
          <div class="row">
            <div class="col-md-12">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${this.activity['video_link']}" allowfullscreen></iframe>
              </div>
            </div>
            <div class="col-md-12">
              <div class="description">${this.activity['description']}</div>
            </div>
          </div>
          ${activityControl}
        </div>`;
        break;
      case 'text':
        html = `
        <div class="activity ${this.published() ? '' : 'unpublish'}">
          <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
          <p class="title lead">${this.activity['title']}</p>
          <p class="text-muted">
            Posted date: ${new Date(this.activity['post_time']).toDateString()}
            Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
          </p>
          <div class="row">
            ${this.activity['text_image'] ? `<div class="col-md-12"><img src="${this.activity['text_image']}" class="img-responsive activity-image"></div>` : ''}
            <div class="col-md-12">
              <div class="description">${this.activity['description']}</div>
            </div>
          </div>
          ${activityControl}
        </div>`;
        break;
      case 'code':
        // handle different links
        if(this.activity['code_link']){
          if(this.activity['code_link'].match(/jsfiddle\.net/) != null){
            this.activity['code_link'] = this.activity['code_link'] + 'embedded/';
          }else if(this.activity['code_link'].match(/plnkr\.co/) != null){
            this.activity['code_link'] = 'https://embed.plnkr.co/' + this.activity['code_link'].replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
          }
        }
        html = `
        <div class="activity ${this.published()? '' : 'unpublish'}">
          <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
          <p class="title lead">${this.activity['title']}</p>
          <p class="text-muted">
            Posted date: ${new Date(this.activity['post_time']).toDateString()}
            Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
          </p>
          <div class="row">
            <div class="col-md-12">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${this.activity['code_link']}" allowfullscreen></iframe>
              </div>
              <div class="description">${this.activity['description']}</div>
            </div>
          </div>
          ${activityControl}
        </div>`;
        break;
      case 'file':
        // handle different links
        console.log(this.activity);
        if(this.activity['file_link']){
          if(this.activity['file_link'].match(/drive\.google\.com/) !== null && this.activity['file_link'].match(/id=(.*)/) !== null){
            this.activity['file_link'] = 'https://drive.google.com/embeddedfolderview?id=' + this.activity['file_link'].match(/id=(.*)/)[1] + '#list';
          }
        }
        html = `
        <div class="activity ${this.published()? '' : 'unpublish'}">
          <h2>${this.index < 10 ? '0' + this.index : this.index}</h2>
          <p class="title lead">${this.activity['title']}</p>
          <p class="text-muted">
            Posted date: ${new Date(this.activity['post_time']).toDateString()}
            Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
          </p>
          <div class="row">
            <div class="col-md-12">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${this.activity['file_link']}" allowfullscreen></iframe>
              </div>
              <div class="description">${this.activity['description']}</div>
            </div>
          </div>
          ${activityControl}
        </div>`;
        break;
      case 'audio':
        html = `
        <div class="activity ${this.published()? '' : 'unpublish'}">
          <h2>${this.index < 10 ? '0' + this.index : this.index}</h2>
          <p class="title lead">${this.activity['title']}</p>
          <p class="text-muted">
            Posted date: ${new Date(this.activity['post_time']).toDateString()}
            Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
          </p>
          <div class="row">
            <div class="col-md-12">
              <span class="glyphicon glyphicon-menu-left audio_left"></span>`;
        try {
          this.activity['audio_image'] = JSON.parse(this.activity['audio_image']);
        } catch (e) {
          this.activity['audio_image'] = [];
        }
        for(var i = 0; i < this.activity['audio_image'].length; i++){
          html += `
              <img data-index="${i}" src="${media_addr + '/' + this.activity['audio_image'][i]}" class="img-responsive ${i === 0 ? '' : 'hidden'} activity-image">`;
        }
        html += `
              <span class="glyphicon glyphicon-menu-right audio_right"></span>
            </div>
            <div class="col-md-12 text-center">`;
        if(!this.activity['audio_audio[]'].push){
          this.activity['audio_audio[]'] = [ this.activity['audio_audio[]'] ];
        }
        for(var i = 0; i < this.activity['audio_audio[]'].length; i++){
          html += `
              <audio controls data-index="${i}" class="${i === 0 ? '' : 'hidden'}">
                <source src="${this.activity['audio_audio[]'][i]}" type="audio/mpeg">
              </audio>`;
        }
        html +=
        `   </div>
            <div class="col-md-12">
              <div class="description">${this.activity['description']}</div>
            </div>
          </div>
          ${activityControl}
        </div>`;
        if(this.activity['audio_audio[]'].length > 1){
          html += `
          <script>
          $(document).off('click', '.audio_left').on('click', '.audio_left', function(e){
            var currentImg = $(this).parent().find('img:visible');
            if(currentImg.data('index') != 0){
              currentImg.prev().removeClass('hidden');
              currentImg.addClass('hidden');
            }
            var currentAudio = $(this).parent().next().find('audio:visible');
            if(currentAudio.data('index') != 0){
              currentAudio.prev().removeClass('hidden');
              currentAudio.addClass('hidden');
            }
          });
          $(document).off('click', '.audio_right').on('click', '.audio_right', function(e){
            var totalImg = $(this).parent().find('img').length;
            var currentImg = $(this).parent().find('img:visible');
            if(currentImg.data('index') < totalImg - 1){
              currentImg.next().removeClass('hidden');
              currentImg.addClass('hidden');
            }
            var totalAudio = $(this).parent().next().find('audio').length;
            var currentAudio = $(this).parent().next().find('audio:visible');
            if(currentAudio.data('index') < totalAudio - 1){
              currentAudio.next().removeClass('hidden');
              currentAudio.addClass('hidden');
            }
          });
          </script>`;
        }
        break;
      default:
        html = `
        <div class="activity">
          <h4>${this.index < 10 ? '0' + this.index : this.index}</h4>
          <p><i>Error occur when rendering activity</i></p>
        </div>`;
    }
    Template.call(this, $(html));
  };

  ActivityTemplate.prototype.updateIndex = function(index)
  {
    this.index = index++;
    console.log(this.activity, index);
    console.log(this.$template);
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  $.extend(ActivityTemplate.prototype, Activity.prototype, Template.prototype);

  return ActivityTemplate;
});
