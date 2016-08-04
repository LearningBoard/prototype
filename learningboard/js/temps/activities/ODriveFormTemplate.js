define(['util', '../ActivityFormTemplate'], function(util, ActivityFormTemplate){
  'use strict';

  var ODriveFormTemplate = function() {

    ActivityFormTemplate.call(this, 'Google Drive', 'gdrive');

    var customFormHtml = `
    <div class="fileList"></div>
    <div class="form-group">
      <input type="text" class="form-control" id="${this.type}_link" name="embedded_link" placeholder="enter your embed code here" required>
      Don't know <a href=https://support.office.com/en-us/article/Embed-files-directly-into-your-website-or-blog-ed07dd52-8bdb-431d-96a5-cbe8a80b7418>how to get the embed code from one drive?</a>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
  };

  /**
   * @override
   */
  ODriveFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    console.log(obj.embedded_link);
    obj.embedded_link = obj.embedded_link;
    return obj;
  }

  $.extend(ODriveFormTemplate.prototype, ActivityFormTemplate.prototype);

  return ODriveFormTemplate;
});
