define(['../ActivityFormTemplate', 'util', 'fileinput'], function(ActivityFormTemplate, util) {
  'use strict';

  var TextFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Text', 'text');

    var customFormHtml = `
    <input type="file" id="${this.type}_image_placeholder">
    <textarea name="${this.type}_image" class="hidden"></textarea>`;
    this.$template.find('.customForm').append(customFormHtml);

    _initImageInput(
      this.$template.find(`#${this.type}_image_placeholder`),
      this.$template.find(`textarea[name=${this.type}_image]`),
      'https://placehold.it/300x200'
    );
  };

  $.extend(TextFormTemplate.prototype, ActivityFormTemplate.prototype);

  TextFormTemplate.prototype.reset = function() {
    _initImageInput(
      this.$template.find(`#${this.type}_image_placeholder`),
      this.$template.find(`textarea[name=${this.type}_image]`),
      'https://placehold.it/300x200'
    );
    ActivityFormTemplate.prototype.reset.call(this);
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

  return TextFormTemplate;
});
