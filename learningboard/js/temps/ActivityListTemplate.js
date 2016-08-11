define(['util', "jquery_ui", 'temps/ListTemplate'], function(util, ui, ListTemplate){
  "use strict";

  var noActHtml = `
  <p class="text-center noElement">
    <i>Currently there are no activities in the board</i>
  </p>`;

  var ActivityListTemplate = function(actTemps)
  {
    // inherits ListTemplate
    if (actTemps === undefined) actTemps = [];

    this.model = util.arrayMapping(actTemps, function(ele) {return ele.model});

    var templateList = actTemps.slice();
    // list of ActivityTemplates

    // inner container
    var $template = $(`
      <div class="listFrame">
        <div class="activityList">
        </div>
      </div>`
    );
    var $container = $template.find(".activityList");
    ListTemplate.call(this, templateList, $template, $container, noActHtml);
    if (this.length === 0) $container.append(noActHtml);
  }

  $.extend(ActivityListTemplate.prototype, ListTemplate.prototype);

  ActivityListTemplate.prototype.onActivityDelete = function(model)
  {
    this.removeElementBy({id: model.id}, {fadeOut: true});
  }

  return ActivityListTemplate;
});
