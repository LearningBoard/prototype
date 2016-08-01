define(['./Template'], function (Template) {
  'use strict';

  var ActivityTabTemplate = function(adapter) {
    var html = `
    <li role="presentation">
      <a data-toggle="tab" role="tab" aria-controls="${adapter.type}" href="#${adapter.type}">
        ${adapter.name}
      </a>
    </li>`;
    Template.call(this, $(html));
  };

  $.extend(ActivityTabTemplate.prototype, Template.prototype);
  return ActivityTabTemplate;
});
