define(['mdls/ODriveData', 'temps/Template'], function(ODriveData, Template) {
  "use strict";

  /**
   * @constructor
   * @param {Array} data - activity data returned from backend
   */
  var ODriveTemplate = function(data, parentModel) {
    this.parentModel = parentModel;
    this.model = new ODriveData(data);
    console.log(this.model);

    var $html = $("<div class='fileView'></div>");
    $html.append(`
      <iframe src="${this.model.odrive_link}" width="100%" frameborder="0" scrolling="no" class="activity-odrive"></iframe>
    `);

    Template.call(this, $html);

  };

  $.extend(ODriveTemplate.prototype, Template.prototype);

  return ODriveTemplate;

});