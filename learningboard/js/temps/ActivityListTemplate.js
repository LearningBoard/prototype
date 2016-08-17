define(['util', "jquery_ui", 'temps/ListTemplate'], function(util, ui, ListTemplate){
  "use strict";

  var noActHTML = `
  <p class="text-center noElement">
    <i>Currently there are no activities in the board</i>
  </p>`;

  var ActivityListTemplate = function(actTemps)
  {
    // inherits ListTemplate
    if (actTemps === undefined) actTemps = [];

    this.model = actTemps.map(function(ele) {return ele.model});

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
    ListTemplate.call(this, 
    {
      templateList: templateList, 
      template: $template, 
      container: $container, 
      noElementHTML: noActHTML
    });
    if (this.length === 0) $container.append(noActHTML);
  }

  $.extend(ActivityListTemplate.prototype, ListTemplate.prototype);

  ActivityListTemplate.prototype.onActivityDelete = function(model)
  {
    this.removeElementBy({id: model.id}, {fadeOut: true});
  }

  return ActivityListTemplate;
});
