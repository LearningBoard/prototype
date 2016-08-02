define(['util', '../ActivityFormTemplate', 'temps/SortableListTemplate', 'temps/GFileListTemplate', 'temps/GFileTemplate', 'lib/GoogleDriveFilePicker'], function(util, ActivityFormTemplate, SortableListTemplate, GFileListTemplate, GFileTemplate, fp){
  'use strict';

  var fileListTemp;

  var GDriveFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Google Drive', 'gdrive');

    var customFormHtml = `
    <div class="fileList"></div>
    <div class="form-group">
      <a id="addFileBtn" class="btn btn-default addFileBtn" style="margin-top: 5px; float: right">Add File</a>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
    fileListTemp = new SortableListTemplate(new GFileListTemplate(), util.urls.gFileOrder);
    this.fileListTemplate = fileListTemp;
    fileListTemp.display(this.$template.find(".fileList"));

    this.$template.find('#addFileBtn').off('click').on('click', _gFilePick);
  };

  var _gFilePick = function() {
    fp.pick(function(data){
      console.log(data)
      var len = data.docs.length;
      for (var ii = 0; ii < len; ++ii)
        fileListTemp.addElement(new GFileTemplate(data.docs[ii], ii));
    });
  };

  $.extend(GDriveFormTemplate.prototype, ActivityFormTemplate.prototype);

  GDriveFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    obj["fileList"] = this.fileListTemplate.model;
    return obj;
  }
  return GDriveFormTemplate;
});
