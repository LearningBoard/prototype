define(['activities/ActivityAdapter', 'lib/GoogleDriveFilePicker'], function(ActivityAdapter, fp){
  'use strict';

  var GDriveAdapter = function() {
    ActivityAdapter.call(this, 'Google Drive', 'gdrive');
  };

  GDriveAdapter.prototype = Object.create(ActivityAdapter.prototype);
  GDriveAdapter.prototype.constructor = GDriveAdapter;

  GDriveAdapter.prototype.renderCustomForm = function() {
    return `
    <div class="fileList"></div>
    <div class="form-group">
      <a id="addFileBtn" class="btn btn-default addFileBtn" style="margin-top: 5px; margin-bottom: 20px; float: right">Add File</a>
    </div>`;
  };

  GDriveAdapter.prototype.beforeCreate = function(template) {
    console.log(template);
    template.find('#addFileBtn').off('click').on('click', _gFilePick);
    ActivityAdapter.prototype.beforeCreate.call(this, template);
  };

  var _gFilePick = function() {
    fp.pick(function(data){
      console.log(data)
    });
  }

  return GDriveAdapter;
});
