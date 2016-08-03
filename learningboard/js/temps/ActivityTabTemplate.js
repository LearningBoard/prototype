define(['./Template'], function (Template) {
  'use strict';

  var ActivityTabTemplate = function(activityFormTemp) {
    var html = `
    <li role="presentation" data-type="${activityFormTemp.type}">
      <a data-toggle="tab" role="tab" aria-controls="${activityFormTemp.type}" href="#${activityFormTemp.type}">
        ${activityFormTemp.name}
      </a>
    </li>`;
    Template.call(this, $(html));
  };

  $.extend(ActivityTabTemplate.prototype, Template.prototype);
  return ActivityTabTemplate;
});
