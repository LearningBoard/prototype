define(['mdls/User', 'mdls/Activity', 'temps/Template', 'temps/ListElement', 'activities/ActivityAdapter', 'activities/VideoAdapter', 'activities/TextAdapter', 'activities/CodeAdapter', 'activities/AudioAdapter', 'activities/GDriveAdapter'], function(User, Activity, Template, ListElement, ActivityAdapter, VideoAdapter, TextAdapter, CodeAdapter, AudioAdapter, GDriveAdapter) {
  "use strict";

  var ActivityTemplate = function(activity, index)
  {
    // index: for the order of display
    // inherits Template

    if (index === undefined) throw "hehe";
    this.model = new Activity(activity);
    ListElement.call(this, ++index);

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
    var adapter = new ActivityAdapter();
    switch(this.model['type'])
    {
      case 'video':
        adapter = new VideoAdapter();
        break;
      case 'text':
        adapter = new TextAdapter();
        break;
      case 'code':
        adapter = new CodeAdapter();
        break;
      case 'audio':
        adapter = new AudioAdapter();
        break;
      case 'gdrive':
        adapter = new GDriveAdapter();
        break;
      default:
        $html = $(`
        <div class="activity">
          <h4>${this.index < 10 ? '0' + this.index : this.index}</h4>
          <p><i>Error occur when rendering activity</i></p>
        </div>`);
    }
    $dif.append(adapter.renderView(this.model));
    Template.call(this, $html);
  };

  ActivityTemplate.prototype.updateIndex = function(index)
  {
    this.index = index++;
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  $.extend(ActivityTemplate.prototype, Template.prototype, ListElement.prototype);

  return ActivityTemplate;
});
