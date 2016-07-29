define(['util', "jquery_ui", 'temps/ListTemplate'], function(util, ui, ListTemplate){
  "use strict";

  var noActHtml = `
  <p class="text-center noActivity">
    <i>Currently there are no activity in this board</i>
  </p>`;

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
      .append(noActHtml);
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

  ActivityListTemplate.prototype.removeActivityAt = function(index)
  {

  }

  ActivityListTemplate.prototype.removeActivityById = function(id)
  {
    var length = this._templateList.length;
    for (var i = 0; i < length; ++i)
    {
      if (this._templateList[i].model.id === id)
      {
        var $tmp = this._templateList[i].$template;
        console.log($tmp);
        $tmp.fadeOut('slow', function(){
          $tmp.remove();
          if($('.activityList .activity').length < 1){
            $('.activityList .noActivity').fadeIn('fast');
          }
        });
        this._templateList.splice(i, 1);
        if (this._templateList.length === 0)
        {
          this.$_container.append(noActHtml);
        }
        this.model.splice(i, 1);
        length--;
        for (var j = i; j < length; ++j)
        {
          this._templateList[j].updateIndex(j);
        }
      }
    }
  }

  $.extend(ActivityListTemplate.prototype, ListTemplate.prototype);

  return ActivityListTemplate;
});
