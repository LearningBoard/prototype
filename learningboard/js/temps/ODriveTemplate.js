define(['mdls/ODriveData', 'temps/Template'], function(ODriveData, Template) {
  "use strict";

  /**
   * @constructor
   * @param {Array} data - activity data returned from backend
   */
  var ODriveTemplate = function(data) {
    this.model = new ODriveData(data);
    console.log(data);

    var $html = $("<div class='fileView'></div>");
    console.log(data.width);
    console.log(data.height);
    $html.append(`
      <iframe src="${this.model.odrive_link}" width="${this.model.width}" height="${this.model.height}" frameborder="0" scrolling="no"></iframe>
    `);
    console.log($html);

    Template.call(this, $html);

  };

  $.extend(ODriveTemplate.prototype, Template.prototype);

  return ODriveTemplate;

});