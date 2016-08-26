define(['util', '../ActivityFormTemplate', 'temps/SortableListTemplate', 'temps/GFileListTemplate', 'temps/GFileTemplate', 'lib/GDriveFilePicker'], function(util, ActivityFormTemplate, SortableListTemplate, GFileListTemplate, GFileTemplate, fp){
  'use strict';

  var GDriveFormTemplate = function() {

    ActivityFormTemplate.call(this, 'Google Drive', 'gdrive');

    var customFormHtml = `
    <div class="fileList"></div>
    <div class="form-group">
      <a id="addFileBtn" class="btn btn-default addFileBtn">Add File</a>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
    this.fileListTemplate = new SortableListTemplate(new GFileListTemplate());
    this.fileListTemplate.display(this.$template.find(".fileList"));
    var thisArg = this;
    this.$template.find('.addFileBtn').off('click').on('click', function() {
      console.log(thisArg);
      fp.pick(function(data){
        console.log(data)
        var len = data.docs.length;
        var idList = thisArg.fileListTemplate.getIdList();
        for (var ii = 0; ii < len; ++ii)
        {
          var lenj = idList.length;
          var flag = false;
          for (var jj = 0; jj < lenj; ++jj)
          {
            if (idList[jj] === data.docs[ii].id)
              flag = true;
          }
          if (flag) continue;

          thisArg.fileListTemplate.addElement(new GFileTemplate(data.docs[ii], ii));
        }
      });
    });
  };

  $.extend(GDriveFormTemplate.prototype, ActivityFormTemplate.prototype);

  /**
   * @override
   */
  GDriveFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    obj["fileList"] = this.fileListTemplate.model;
    return obj;
  }

  /**
   * @override
   */
  GDriveFormTemplate.prototype.reset = function() {
    var obj = ActivityFormTemplate.prototype.reset.call(this);
    this.fileListTemplate.remove();
    this.fileListTemplate = new SortableListTemplate(new GFileListTemplate());
    this.fileListTemplate.display(this.$template.find(".fileList"));

    return obj;
  }

  /**
   * @override
   */
  GDriveFormTemplate.prototype.setData = function(act) {
    ActivityFormTemplate.prototype.setData.call(this, act);
    this.fileListTemplate.empty();
    var len = act.data.fileList.length;
    for (var ii = 0; ii < len; ++ii)
      this.fileListTemplate.addElement(new GFileTemplate(act.data.fileList[ii]));
  }

  return GDriveFormTemplate;
});
