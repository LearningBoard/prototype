define(['temps/ListTemplate'], function(ListTemplate){

  function ActivityListTemplate(actTemps)
  {
    // inherits ListTemplate

    var _templateList = actTemps.slice();
    // list of ActivityTemplates

    // inner container
    $template = $(`
      <div class="listFrame">
        <div class="activityList">
        </div>
      </div>`
    );
    $container = $template.find(".activityList");
    if (actTemps.length === 0)
    {
      $container.append(`<p class="text-center noActivity"><i>Currently there are no activity in this board</i></p>`);
    }
    ListTemplate.call(this, _templateList, $template, $container);
  }

  ActivityListTemplate.prototype.addActivity = function(act)
  {
    var index = this._templateList.length;
    this._templateList.push(act);
    act.display(this.$_container);
  }

  ActivityListTemplate.prototype.updateActivity = function(act, index)
  {
    this._templateList[index] = act;
    act.render(activity);
    this.$_container.find('.activity:eq('+index+')').replaceWith($(act.$template));
  }

  $.extend(ActivityListTemplate.prototype, ListTemplate.prototype);

  return ActivityListTemplate;
});
