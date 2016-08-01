define(['../ActivityFormTemplate', 'lib/GoogleDriveFilePicker'], function(ActivityFormTemplate, fp){
  'use strict';

  var GDriveFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Google Drive', 'gdrive');

    var customFormHtml = `
    <div class="fileList"></div>
    <div class="form-group">
      <a id="addFileBtn" class="btn btn-default addFileBtn" style="margin-top: 5px; margin-bottom: 20px;">Add File</a>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);

    console.log(this.$template);
    this.$template.find('#addFileBtn').off('click').on('click', _gFilePick);
  };

  var _gFilePick = function() {
    fp.pick(function(data){
      console.log(data)
    });
  };

  $.extend(GDriveFormTemplate.prototype, ActivityFormTemplate.prototype);
  return GDriveFormTemplate;
});
