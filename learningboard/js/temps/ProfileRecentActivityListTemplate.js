define(['temps/ListTemplate'], function(ListTemplate){
  'use strict';

  var ProfileRecentActivityListTemplate = function(recentActivityTemps) {

    if (recentActivityTemps === undefined) recentActivityTemps = [];
    var templateList = recentActivityTemps.slice();
    var $template = $(`
      <div class="listFrame">
        <div class="recentActivityList">
        </div>
      </div>`
    );
    var $container = $template.find('.recentActivityList');
    var noRecentActivityHTML = `
    <div class="row thumbnail sidebar-item">
      <div class="col-sm-12 opaque-75" style="padding: 5px; padding-left: 0">
        <i>No recent activity</i>
      </div>
    </div>`;

    ListTemplate.call(this, {
      templateList: templateList,
      template: $template,
      container: $container,
      noElementHTML: noRecentActivityHTML
    });
    if (this.length === 0) $container.append(noRecentActivityHTML);
  }

  $.extend(ProfileRecentActivityListTemplate.prototype, ListTemplate.prototype);

  return ProfileRecentActivityListTemplate;
});
