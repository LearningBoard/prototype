define(['util', 'activities/ActivityAdapter', 'temps/SortableListTemplate', 'temps/GFileListTemplate', 'lib/GoogleDriveFilePicker'], function(util, ActivityAdapter, SortableListTemplate, GFileListTemplate, fp){
  'use strict';

  var GDriveAdapter = function() {
    ActivityAdapter.call(this, 'Google Drive', 'gdrive');
  };

  GDriveAdapter.prototype = Object.create(ActivityAdapter.prototype);
  GDriveAdapter.prototype.constructor = GDriveAdapter;

  GDriveAdapter.prototype.renderCustomForm = function() {
    var $temp = $(`
      <div>
        <div class="fileListContainer"></div>
        <div class="form-group">
          <a id="addFileBtn" class="btn btn-default addFileBtn" style="margin-top: 5px; float: right">Add File</a>
        </div>
      </div> `
    );

    console.log($("#gdrive")); 
    var file_list = new SortableListTemplate(new GFileListTemplate(), util.urls.gFileOrder);
    console.log(file_list);
    file_list.display($temp.find("div.fileListContainer"));
    console.log($temp);

    $temp.find("#addFileBtn").on("click", _gFilePick);
    return $temp;
  };
  
  var _gFilePick = function()
  {
    fp.pick(function(data){
      console.log(data)
      var length = data.docs.length;
      for (var i = 0; i < length; ++i)
      {
        file_list.addElement(new GFileTemplate(data.docs[i]));
      }
    });
  }

  GDriveAdapter.prototype.beforeCreate = function() {
    console.log($('#gdrive'));
    $('#addFileBtn').off('click').on('click', _gFilePick);
  };

  return GDriveAdapter;
});
