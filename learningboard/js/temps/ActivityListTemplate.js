define(['util', 'temps/ListTemplate'], function(util, ListTemplate){
  "use strict";

  var ActivityListTemplate = function(actTemps)
  {
    // inherits ListTemplate

    this.model = util.arrayMapping(actTemps, function(ele) {return ele.model});

    var _templateList = actTemps.slice();
    // list of ActivityTemplates

    // inner container
    var $template = $(`
      <div class="listFrame">
        <div class="activityList">
        </div>
      </div>`
    );
    var $container = $template.find(".activityList");
    if (actTemps.length === 0)
    {
      $container
      .append(`
        <p class="text-center noActivity">
          <i>Currently there are no activity in this board</i>
        </p>`
      );
    }
    ListTemplate.call(this, _templateList, $template, $container);
  }

  ActivityListTemplate.prototype.addActivity = function(act_t)
  {
    this.model.push(act_t.model);
    this._templateList.push(act_t);

    this.$_container.children(".noActivity").remove();
    act_t.display(this.$_container);
  }

  ActivityListTemplate.prototype.updateActivity = function(act_t, index)
  {
    this.model[index] = act_t.model;
    this._templateList[index] = act_t;

    this.$_container.find('.activity:eq('+index+')')
    .replaceWith($(act.$template));
  }

  $.extend(ActivityListTemplate.prototype, ListTemplate.prototype);

  return ActivityListTemplate;
});
