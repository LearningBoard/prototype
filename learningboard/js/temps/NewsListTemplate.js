define(['temps/ListTemplate'], function(ListTemplate){
  'use strict';

  var NewsListTemplate = function(temps) {

    if (temps === undefined) temps = [];
    var templateList = temps.slice();
    var $template = $(`
      <div class="listFrame">
        <div class="newsList">
        </div>
      </div>`
    );
    var $container = $template.find('.newsList');
    var noRecentActivityHTML = `
    <div class="row">
      <div class="col-md-12">
        <p class="lead">No news found.</p>
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

  $.extend(NewsListTemplate.prototype, ListTemplate.prototype);
  return NewsListTemplate;
});
