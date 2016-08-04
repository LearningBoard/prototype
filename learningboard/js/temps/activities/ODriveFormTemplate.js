define(['util', '../ActivityFormTemplate'], function(util, ActivityFormTemplate){
  'use strict';

  //<iframe src="https://onedrive.live.com/embed?cid=2326522F2C4F4816&resid=2326522F2C4F4816%21104&authkey=ANbiZvekm6PKDuM&em=2" width="476" height="288" frameborder="0" scrolling="no"></iframe>
  https://1drv.ms/f/s!AhZITywvUiYjaSQeWDWyANc_T4A

  var ODriveFormTemplate = function() {

    ActivityFormTemplate.call(this, 'One Drive', 'odrive');

    var customFormHtml = `
    <div class="fileList"></div>
    <div class="form-group">
      <label for="odrive_link">Embed Code</label>
      <input type="text" class="form-control" id="${this.type}_link" name="odrive_link" placeholder="paste your embed code here" required>
      Don't know <a target="_blank" href=https://support.office.com/en-us/article/Embed-files-directly-into-your-website-or-blog-ed07dd52-8bdb-431d-96a5-cbe8a80b7418>how to get the embed code from one drive</a>?
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(ODriveFormTemplate.prototype, ActivityFormTemplate.prototype);

  /**
   * @override
   */
  ODriveFormTemplate.prototype.serializeObject = function() {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    var o1, o2, link;

    console.log(obj.odrive_link);

    link = obj.odrive_link; 
    o1 = link.indexOf('"');
    o2 = link.indexOf('"', o1+1);
    obj.odrive_link = link.substring(o1+1, o2);
    o1 = link.indexOf('"', o2+1);
    o2 = link.indexOf('"', o1+1);
    obj.width = link.substring(o1+1, o2);
    o1 = link.indexOf('"', o2+1);
    o2 = link.indexOf('"', o1+1);
    obj.height = link.substring(o1+1, o2);

    console.log(obj);

    return obj;
  }

  return ODriveFormTemplate;
});
