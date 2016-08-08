define(['mdls/User', 'mdls/Activity', 'temps/ListElementTemplate',
'lib/ViewDispatcher'], function(User, Activity, ListElementTemplate,
 ViewDispatcher) {"use strict";

  var _get_html = function(model, index) 
  {
    var html = '';
    var $html, $dif;
    var activityControl;
    if(User.is_staff() && location.href.includes('board_edit.html')){
      activityControl = `
      <div class="control" data-id="${model.id}">
        <ul>
          <li ${model.published() ? 'class="hidden"' : ''}>
            <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
          </li>
          <li ${model.published() ? '' : 'class="hidden"'}>
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
      <div class="control" data-id="${model.id}">
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
    index++;
    $html = $(`
      <div class="activity ${model.published() ? '' : 'unpublish'}">
        <h2 class="index">${index < 10 ? '0' + index : index}</h2>
        <p class="title lead">${model['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(model.createdAt).toDateString()}<br/>
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p><br/>
        <div class="row">
          <div class="col-md-12">
            <div name="dif"> </div>
          </div>
          <div class="col-md-12">
            <div class="description">${model.description}</div>
          </div>
        </div>
        ${activityControl}
      </div>
    `);
    $dif = $html.find("[name='dif']");
    var Resource = ViewDispatcher.activities.getView(model.type);
    var rsc = new Resource(model.data);
    rsc.display($dif);
    return $html;
  }

  /**
   * @constructor
   * @param activity - the activity data
   * @param index - for the order of displaying
   */
  var ActivityTemplate = function(activity, index)
  {
    this.model = new Activity(activity);
    console.log(this.model);

    if(activity){
      this.model = new Activity(activity);
    }
    ListElementTemplate.call(this, _get_html(this.model, index), index);
  };

  ActivityTemplate.prototype.updateIndex = function(index)
  {
    this.index = index;
    index++;
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  ActivityTemplate.prototype.update = function(model, index) 
  {
    if (index === undefined) index = this.index;
    var new_html = _get_html(model, index);
    this.model = model;
    this.$template.replaceWith(new_html);
    this.$template = new_html;
  }

  $.extend(ActivityTemplate.prototype, ListElementTemplate.prototype);

  return ActivityTemplate;
});
