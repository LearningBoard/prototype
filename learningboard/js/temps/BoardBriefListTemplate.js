define(['config', "temps/ListTemplate"], function(config, ListTemplate) {
  "use strict";

  var BoardBriefListTemplate = function(temps) {
    if (temps === undefined) temps = [];
    var templateList = temps.slice();
    var $template = $(`
      <div class="listFrame">
        <div class="boardBriefList">
        </div>
      </div>`
    );
    var $container = $template.find('.boardBriefList');
    var noRecentActivityHTML = `<p class="lead">Could not find any ${config.appName}. Create your own one today.</p>`;

    ListTemplate.call(this,
    {
      templateList: templateList,
      template: $template,
      container: $container,
      noElementHTML: noRecentActivityHTML
    });
    if (this.length === 0) $container.append(noRecentActivityHTML);
  };

  $.extend(BoardBriefListTemplate.prototype, ListTemplate.prototype);

  return BoardBriefListTemplate;
});
