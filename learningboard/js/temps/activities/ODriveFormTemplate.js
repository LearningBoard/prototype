define(['util', '../ActivityFormTemplate', "temps/SortableListTemplate", "lib/ODriveFilePicker"], function(util, ActivityFormTemplate, SortableListTemplate, fp){
  'use strict';

  //<iframe src="https://onedrive.live.com/embed?cid=2326522F2C4F4816&resid=2326522F2C4F4816%21104&authkey=ANbiZvekm6PKDuM&em=2" width="476" height="288" frameborder="0" scrolling="no"></iframe> https://1drv.ms/f/s!AhZITywvUiYjaSQeWDWyANc_T4A

  var ODriveFormTemplate = function() {

    ActivityFormTemplate.call(this, 'OneDrive', 'odrive');

    var $customFormHtml = $(`
    <div class="fileList"></div>
    <iframe class="shared_ofile hidden"></iframe>
    <div class="form-group">
      <input type="hidden" name="odrive_link" value=""></input>
    <a class="btn btn-default selectFileBtn">Select Files</a>
    </div>
    `);
    this.$template.find('.customForm').append($customFormHtml);
    var thisArg = this;
    
    this.$template.find('.selectFileBtn').off('click').on('click', function() {
      fp.pick(function(data) {

        var embed_view = thisArg.$template.find(".shared_ofile");
        embed_view.attr("src", data.webUrl).removeClass("hidden");

        thisArg.$template.find('[name="odrive_link"]').attr("value", data.webUrl);
     });
    });
  };

  $.extend(ODriveFormTemplate.prototype, ActivityFormTemplate.prototype);

  /**
   * @override
   */
  ODriveFormTemplate.prototype.reset = function() {
    var obj = ActivityFormTemplate.prototype.reset.call(this);
    this.$template.find('[name="odrive_link"]').val("");
    this.$template.find("iframe.shared_ofile").attr("src", "").addClass("hidden");
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
