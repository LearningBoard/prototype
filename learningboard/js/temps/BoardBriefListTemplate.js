define(["temps/ListTemplate"], function(ListTemplate) {
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
    var noRecentActivityHTML = '<p class="lead">Could not find any Learning Boards. Create your own one today.</p>';

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
