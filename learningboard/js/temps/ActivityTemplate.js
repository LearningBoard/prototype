define(['util', 'mdls/User', 'mdls/Activity', 'temps/ListElementTemplate', 'temps/CommentableTemplate', 'temps/ActivityEditControl', 'temps/ActivityActionControl', 'lib/ViewDispatcher'], function(util, User, Activity, ListElementTemplate, CommentableTemplate, ActivityEditControl, ActivityActionControl, ViewDispatcher) {
  "use strict";

  var _get_html = function(model, index)
  {
    var html = '';
    var $html, $dif;
    index++;
    $html = $(`
      <div class="activity ${model.published() ? '' : 'unpublish'}">
        <h2 class="index">${index < 10 ? '0' + index : index}</h2>
        <p class="title lead">${model['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(model.createdAt).toDateString()}<br/>
          Author/Publisher: <a href="profile.html?${model.author.id}" target="_blank">${model.author.username}</a>
        </p><br/>
        <div class="row">
          <div class="col-md-12">
            <div name="dif"> </div>
          </div>
          <div class="col-md-12">
            <div class="description">${model.description}</div>
          </div>
        </div>
        <div class="activityControl"></div>
        <div class="activityComment"></div>
      </div>
    `);
    $dif = $html.find("[name='dif']");
    var Resource = ViewDispatcher.activities.getView(model.type);
    var rsc = new Resource(model.data, model);
    rsc.display($dif);

    var editMode = location.href.includes('board_edit.html');

    if (!editMode) {
      var $activityComment = $html.find('div.activityComment');
      var commentTemp = new CommentableTemplate(model);
      commentTemp.display($activityComment);
    }

    return $html;
  }

  /**
   * @constructor
   * @param activity - the activity data
   * @param index - for the order of displaying
   * @param BoardDetailTemplate - the board detail template
   */
  var ActivityTemplate = function(activity, index)
  {
    this.model = new Activity(activity);
    this.controller = null;

    if(activity){
      this.model = new Activity(activity);
    }
    ListElementTemplate.call(this, _get_html(this.model, index), index);
  };

  $.extend(ActivityTemplate.prototype, ListElementTemplate.prototype);

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
    this.controller.display(this.$template.find(".activityControl"));
  }

  ActivityTemplate.prototype.addControl = function(ctrl)
  {
    this.controller = ctrl;

    ctrl.display(this.$template.find(".activityControl"));

    return this;
  }

  return ActivityTemplate;
});
