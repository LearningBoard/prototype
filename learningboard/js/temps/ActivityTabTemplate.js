define(['./Template'], function (Template) {
  'use strict';

  var ActivityTabTemplate = function(name, type) {
    var html = `
    <li role="presentation">
      <a data-toggle="tab" role="tab" aria-controls="${type}" href="#${type}">
        ${name}
      </a>
    </li>`;
    Template.call(this, $(html));
  };

  $.extend(ActivityTabTemplate.prototype, Template.prototype);
  return ActivityTabTemplate;
});
