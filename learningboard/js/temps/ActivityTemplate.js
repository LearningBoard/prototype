 define(['mdls/User', 'mdls/Activity', 'temps/Template'], function(User, Activity, Template) {
  "use strict";

  var ActivityTemplate = function(activity, index)
  {
    // index: for the order of display
    // inherits Activity and Template

    if (index === undefined) throw "hehe";
    this.model = new Activity(activity);
    this.index = ++index;

    if(activity){
      this.model = new Activity(activity);
    }
    var html = '';
    var $html, $dif;
    var activityControl;

    if(User.is_staff() && location.href.includes('board_edit.html')){
      activityControl = `
      <div class="control" data-id="${this.model.id}">
        <ul>
          <li ${this.model['status'] == 0 ? 'class="hidden"' : ''}>
            <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
          </li>
          <li ${this.model['status'] == 0 ? '' : 'class="hidden"'}>
            <span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span>
          </li>
          <li>
            <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
          </li>
          <li>
            <span class="glyphicon glyphicon-remove" name="removeBtn" aria-hidden="true"></span>
          </li>
        </ul>
      </div>`;
    }
    else
    {
      activityControl = `
      <div class="control" data-id="${this.model.id}">
        <ul class="text-muted">
          <li>
            <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
            Share
          </li>
          <li class="markAsComplete">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            Mark as complete
          </li>
          <li>
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            Delete
          </li>
        </ul>
      </div>`;
    }
    $html = $(`
      <div class="activity ${this.model.published() ? '' : 'unpublish'}">
        <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
        <p class="title lead">${this.model['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(this.model.createdAt).toDateString()}<br/>
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p><br/>
        <div id="dif"></div>
        ${activityControl}
      </div>
    `);
    $dif = $html.find("#dif");
    switch(this.model['type'])
    {
      case 'video':
        // handle different links
        $dif.append(`
          <div class="row">
            <div class="col-md-12">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${this.model.src_link}" allowfullscreen></iframe>
              </div>
            </div>
            <div class="col-md-12">
              <div class="description">${this.model['description']}</div>
            </div>
          </div>
          ${activityControl}
        `);
        break;
      case 'text':
      console.log(this.model);
        $dif.append(`
          <div class="row">
            ${this.model['text_image'] ? `<div class="col-md-12"><img src="${this.model.src_link}" class="img-responsive activity-image"></div>` : ''}
            <div class="col-md-12">
              <div class="description">${this.model['description']}</div>
            </div>
          </div>
        `);
        break;
      case 'code':
        $dif.append(`
          <div class="row">
            <div class="col-md-12">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${this.model.src_link}" allowfullscreen></iframe>
              </div>
              <div class="description">${this.model['description']}</div>
            </div>
          </div>
        `);
        break;
      case 'folder':
        // handle different links
        console.log(this.model);
        $dif.append(`
          <div class="row">
            <div class="col-md-12">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${this.model.src_link}" allowfullscreen></iframe>
              </div>
              <div class="description">${this.model.description}</div>
            </div>
          </div>
        `);
        break;
      case 'audio':
        break;
        html = `
          <div class="row">
            <div class="col-md-12">
              <span class="glyphicon glyphicon-menu-left audio_left"></span>`;
        try {
          this.model['audio_image'] = JSON.parse(this.model['audio_image']);
        } catch (e) {
          this.model['audio_image'] = [];
        }
        for(var i = 0; i < this.model['audio_image'].length; i++){
          html += `
              <img data-index="${i}" src="${media_addr + '/' + this.model['audio_image'][i]}" class="img-responsive ${i === 0 ? '' : 'hidden'} activity-image">`;
        }
        html += `
              <span class="glyphicon glyphicon-menu-right audio_right"></span>
            </div>
            <div class="col-md-12 text-center">
        `;
        console.log(this.model);
        if(!this.model['audio_audio[]'].push){
          this.model['audio_audio[]'] = [ this.model['audio_audio[]'] ];
        }
        for(var i = 0; i < this.model['audio_audio[]'].length; i++){
          html += `
              <audio controls data-index="${i}" class="${i === 0 ? '' : 'hidden'}">
                <source src="${this.model['audio_audio[]'][i]}" type="audio/mpeg">
              </audio>`;
        }
        html += `
          </div>
            <div class="col-md-12">
              <div class="description">${this.model['description']}</div>
            </div>
          </div>
        `;
        if(this.model['audio_audio[]'].length > 1){
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
        $html = `
        <div class="activity">
          <h4>${this.index < 10 ? '0' + this.index : this.index}</h4>
          <p><i>Error occur when rendering activity</i></p>
        </div>`;
    }
    Template.call(this, $html);
  };

  ActivityTemplate.prototype.updateIndex = function(index)
  {
    this.index = index++;
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  $.extend(ActivityTemplate.prototype, Template.prototype);

  return ActivityTemplate;
});
