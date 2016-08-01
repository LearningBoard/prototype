define(function(){
  'use strict';

  var ActivityAdapter = function (name, type){
    this.name = name; // Activity type, human readable name
    this.type = type ? type.toLowerCase() : type; // Activity type, also act as a namespace
  };

  // Custom field for this activity type (other than title & description)
  ActivityAdapter.prototype.renderCustomForm = function() {
    return '';
  };

  // Render content part of activity
  ActivityAdapter.prototype.renderView = function(modelData) {
    return `
    <div class="row">
      <div class="col-md-12">
        <p><i>Error occur when rendering activity</i></p>
      </div>
    </div>`;
  };

  // Actions to perform before creating new activity
  ActivityAdapter.prototype.beforeCreate = function(template) {
    _initCkeditor(template);
  };

  // Actions to perform after created new activity
  ActivityAdapter.prototype.afterCreate = function(template, modelData) {
    _initCkeditor(template);
  };

  // Actions to perform before editing activity
  ActivityAdapter.prototype.beforeEdit = function(template, modelData) {
    _initCkeditor(template);
  };

  // Actions to perform after edited activity
  ActivityAdapter.prototype.afterEdit = function(template, modelData) {
    _initCkeditor(template);
  };

  var _initCkeditor = function (template){
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

  return ActivityAdapter;
});
