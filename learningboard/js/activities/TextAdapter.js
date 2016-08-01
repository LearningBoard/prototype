define(['activities/ActivityAdapter', 'util', 'fileinput'], function(ActivityAdapter, util) {
  'use strict';

  var TextAdapter = function() {
    ActivityAdapter.call(this, 'Text', 'text');
  };

  TextAdapter.prototype = Object.create(ActivityAdapter.prototype);
  TextAdapter.prototype.constructor = TextAdapter;

  TextAdapter.prototype.renderCustomForm = function() {
    return `
    <input type="file" id="${this.type}_image_placeholder">
    <textarea name="${this.type}_image" class="hidden"></textarea>`;
  };

  TextAdapter.prototype.renderView = function(modelData) {
    return `
    <div class="row">
      ${modelData.text_image ? `<div class="col-md-12"><img src="${modelData.text_image}" class="img-responsive activity-image"></div>` : ''}
      <div class="col-md-12">
        <div class="description">${modelData.description}</div>
      </div>
    </div>`;
  };

  TextAdapter.prototype.beforeCreate = function(template) {
    _initImageInput(
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      'https://placehold.it/300x200'
    );
    ActivityAdapter.prototype.beforeCreate.call(this, template);
  };

  TextAdapter.prototype.afterCreate = function(template, modelData) {
    _initImageInput(
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      'https://placehold.it/300x200'
    );
    ActivityAdapter.prototype.afterCreate.call(this, template, modelData);
  };

  TextAdapter.prototype.beforeEdit = function(template, modelData) {
    _initImageInput(
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      modelData.data[`${this.type}_image`] ? modelData.data[`${this.type}_image`] : 'https://placehold.it/300x200'
    );
    ActivityAdapter.prototype.beforeEdit.call(this, template, modelData);
  };

  TextAdapter.prototype.afterEdit = function(template, modelData) {
    _initImageInput(
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      'https://placehold.it/300x200'
    );
    ActivityAdapter.prototype.afterEdit.call(this, template, modelData);
  };

  var _initImageInput = function (inputEle, targetEle, url) {
    inputEle.fileinput('destroy');
    var instance = inputEle.fileinput({
      showClose: false,
      showCaption: false,
      showBrowse: false,
      browseOnZoneClick: true,
      overwriteInitial: true,
      removeLabel: 'Remove image',
      removeClass: 'btn btn-default btn-block btn-xs',
      defaultPreviewContent: `<div align="center"><img src="${url}" alt="Image" width="300" class="img-responsive">
      <h6 class="text-muted text-center">Click to select image</h6></div>`,
      layoutTemplates: {
        main2: '{preview} {remove}',
        actions: ''
      },
      allowedFileExtensions: ['jpg', 'png', 'gif']
    });
    (function(instance) {
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader){
        util.post('/media', {data: reader.result}, function(res) {
          targetEle.val(res.data.file);
        });
      });
      instance.off('filecleared').on('filecleared', function(e) {
        _initImageInput(inputEle, targetEle, 'https://placehold.it/300x200');
        targetEle.val('');
      });
    })(instance);
  };

  return TextAdapter;
});
