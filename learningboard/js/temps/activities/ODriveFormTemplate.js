define(['util', '../ActivityFormTemplate', "temps/SortableListTemplate", "lib/ODriveFilePicker"], function(util, ActivityFormTemplate, SortableListTemplate, fp){
  'use strict';

  //<iframe src="https://onedrive.live.com/embed?cid=2326522F2C4F4816&resid=2326522F2C4F4816%21104&authkey=ANbiZvekm6PKDuM&em=2" width="476" height="288" frameborder="0" scrolling="no"></iframe> https://1drv.ms/f/s!AhZITywvUiYjaSQeWDWyANc_T4A

  var ODriveFormTemplate = function() {

    ActivityFormTemplate.call(this, 'OneDrive', 'odrive');

    var $customFormHtml = $(`
    <div class="fileList"></div>
    <div class="form-group">
      <iframe class="shared_ofile"></iframe>
      <input type="hidden" name="odrive_link" value=""></input>
    </div>
    <a class="btn btn-default selectFileBtn">Select Files</a>
    `);
    this.$template.find('.customForm').append($customFormHtml);
    var thisArg = this;
    this.$template.find('.selectFileBtn').off('click').on('click', function() {
      fp.pick(function(data) {

        console.log(data);
        var embed_view = thisArg.$template.find(".shared_ofile");
        var odrive_link_input = thisArg.$template.find('[name="odrive_link"]');
        odrive_link_input.attr("value", data.webUrl);
        embed_view.attr("src", data.webUrl);
     });
    });
  };

  $.extend(ODriveFormTemplate.prototype, ActivityFormTemplate.prototype);

  /**
   * @override
   */
  ODriveFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    return obj;
  }

  /**
   * @override
   */
  ODriveFormTemplate.prototype.reset = function() {
    var obj = ActivityFormTemplate.prototype.reset.call(this);
    this.$template.find('[name="odrive_link"]').val("");
    this.$template.find("iframe.shared_ofile").attr("src", "");
    return obj;
  }

  /**
   * @override
   */
  ODriveFormTemplate.prototype.setData = function(act) {
    var obj = ActivityFormTemplate.prototype.setData.call(this, act);
    this.$template.find('[name="odrive_link"]').val(act.data.odrive_link);
    this.$template.find("iframe.shared_ofile").attr("src", act.data.odrive_link);
    return obj;
  };


  return ODriveFormTemplate;
});
