define(['./Template'], function (Template) {
  'use strict';

  /**
   * @constructor
   * @param {string} name - Activity type, human readable name
   * @param {string} type - Activity type, also act as a namespace
   */
  var ActivityFormTemplate = function(name, type) {
    this.name = name;
    this.type = type ? type.toLowerCase() : type;

    var html = `
    <div role="tabpanel" class="tab-pane" id="${this.type}">
      <form class="addActivityForm">
        <input type="hidden" name="id" value="">
        <input type="hidden" name="type" value="${this.type}">
        <div class="form-group">
          <label for="${this.type}_title">Title</label>
          <input type="text" class="form-control" id="${this.type}_title" name="title" placeholder="activity title" required>
        </div>
        <div class="customForm"></div>
        <div class="form-group">
          <label for="${this.type}_description">Description</label>
          <textarea class="form-control" id="${this.type}_description" name="description" rows="3" placeholder="Description"></textarea>
        </div>
        <button type="submit" class="btn btn-default addActivityBtn">Submit</button>
        <span class="result_msg"></span>
      </form>
    </div>`;
    Template.call(this, $(html));

    _initCkeditor(this.$template);
  };

  ActivityFormTemplate.prototype.reset = function() {
    var editorName = this.$template.find('[name=description]').attr('id');
    CKEDITOR.instances[editorName].setData('');
    this.$template.find('[name=id]').val('');
    this.$template.find('form')[0].reset();
  };

  var _initCkeditor = function(template) {
    $.getScript('https://cdn.ckeditor.com/4.5.9/standard/ckeditor.js', function(){
      var target = template.find('[name=description]');
      var editor = CKEDITOR.replace(target.attr('id'), {
        language: 'en'
      });
      (function(editor){
        editor.on('change', function(e){
          template.find('#' + e.editor.name).val(e.editor.getData());
        });
      })(editor);
    });
  };

  ActivityFormTemplate.prototype.serializeObject = function() {
    return this.$template.find("form.addActivityForm").serializeObject();
  }

  $.extend(ActivityFormTemplate.prototype, Template.prototype);
  return ActivityFormTemplate;
});
