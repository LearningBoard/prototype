define(['activities/ActivityAdapter', 'util', 'fileinput'], function(ActivityAdapter, util) {
  'use strict';

  var AudioAdapter = function() {
    ActivityAdapter.call(this, 'Audio', 'audio');
  };

  AudioAdapter.prototype = Object.create(ActivityAdapter.prototype);
  AudioAdapter.prototype.constructor = AudioAdapter;

  AudioAdapter.prototype.renderCustomForm = function() {
    return `
    <label class="control-label">Select File</label>
    <input id="${this.type}_image_placeholder" type="file" class="file-loading" multiple>
    <textarea name="${this.type}_image" class="hidden"></textarea>
    <div class="form-group">
      <label for="${this.type}_audio">Audio</label>
      <div class="${this.type}_group"></div>
    </div>`;
  };

  AudioAdapter.prototype.renderView = function(modelData) {
    var html = `
      <div class="row">
        <div class="col-md-12">
          <span class="glyphicon glyphicon-menu-left audio_left"></span>`;
    try {
      modelData.data.audio_image = JSON.parse(modelData.data.audio_image);
    } catch (e) {
      modelData.data.audio_image = [];
    }
    for(var i = 0; i < modelData.data.audio_image.length; i++){
      html += `
          <img data-index="${i}" src="${util.media_addr + '/' + modelData.data.audio_image[i]}" class="img-responsive ${i === 0 ? '' : 'hidden'} activity-image">`;
    }
    html += `
          <span class="glyphicon glyphicon-menu-right audio_right"></span>
        </div>
        <div class="col-md-12 text-center">
    `;
    if(!modelData.data['audio_audio[]'].push){
      modelData.data['audio_audio[]'] = [ modelData.data['audio_audio[]'] ];
    }
    for(var i = 0; i < modelData.data['audio_audio[]'].length; i++){
      html += `
          <audio controls data-index="${i}" class="${i === 0 ? '' : 'hidden'}">
            <source src="${modelData.data['audio_audio[]'][i]}" type="audio/mpeg">
          </audio>`;
    }
    html += `
      </div>
        <div class="col-md-12">
          <div class="description">${modelData.description}</div>
        </div>
      </div>
    `;
    if(modelData.data['audio_audio[]'].length > 1){
      html += `
      <script>
      $(document).off('click', '.audio_left').on('click', '.audio_left', function(e){
        var currentImg = $(this).parent().find('img:visible');
        if(currentImg.data('index') != 0){
          currentImg.prev().removeClass('hidden');
          currentImg.addClass('hidden');
        }
        var currentAudio = $(this).parent().next().find('audio:visible');
        if(currentAudio.data('index') != 0){
          currentAudio.prev().removeClass('hidden');
          currentAudio.addClass('hidden');
        }
      });
      $(document).off('click', '.audio_right').on('click', '.audio_right', function(e){
        var totalImg = $(this).parent().find('img').length;
        var currentImg = $(this).parent().find('img:visible');
        if(currentImg.data('index') < totalImg - 1){
          currentImg.next().removeClass('hidden');
          currentImg.addClass('hidden');
        }
        var totalAudio = $(this).parent().next().find('audio').length;
        var currentAudio = $(this).parent().next().find('audio:visible');
        if(currentAudio.data('index') < totalAudio - 1){
          currentAudio.next().removeClass('hidden');
          currentAudio.addClass('hidden');
        }
      });
      </script>`;
    }
    return html;
  };

  AudioAdapter.prototype.beforeCreate = function(template) {
    _initAudioActivity(
      template,
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      true,
      null
    );
    ActivityAdapter.prototype.beforeCreate.call(this, template);
  };

  AudioAdapter.prototype.afterCreate = function(template, modelData) {
    _initAudioActivity(
      template,
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      true,
      null
    );
    ActivityAdapter.prototype.afterCreate.call(this, template, modelData);
  };

  AudioAdapter.prototype.beforeEdit = function(template, modelData) {
    _initAudioActivity(
      template,
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      false,
      modelData[`${this.type}_image`]
    );
    for(var i = 0; i < data[key].length; i++){
      var instance = addAudioGroup();
      instance.find('textarea[name="audio_audio[]"]').val(data[key][i]);
      instance.find('div.lbRecorder').html(`
        <audio controls>
          <source src="${data[key][i]}" type="audio/mpeg">
        </audio>`).removeClass('hidden');
    }
    ActivityAdapter.prototype.beforeEdit.call(this, template, modelData);
  };

  AudioAdapter.prototype.afterEdit = function(template, modelData) {
    _initAudioActivity(
      template,
      template.find(`#${this.type}_image_placeholder`),
      template.find(`textarea[name=${this.type}_image]`),
      true,
      null
    );
    ActivityAdapter.prototype.afterEdit.call(this, template, modelData);
  };

  var _initAudioActivity = function(template, inputEle, targetEle, clear, url) {
    if (clear) template.find('.audio_group').text('Please upload at least one image before recording');
    inputEle.fileinput('destroy');
    var options = {
      showClose: false,
      showCaption: false,
      showBrowse: false,
      showRemove: false,
      showUpload: false,
      browseOnZoneClick: true,
      overwriteInitial: false,
      defaultPreviewContent: `<div align="center"><img src="https://placehold.it/300x200" alt="Image" width="300" class="img-responsive">
      <h6 class="text-muted text-center">Click to select image</h6></div>`,
      layoutTemplates: {
        footer: '<div class="file-thumbnail-footer"><small><i>Remove</i></small></div>',
      }
    };
    if (url) {
      url = url.map(function(value) {
        return util.media_addr + '/' + value;
      });
      $.extend(options, {initialPreview: url, initialPreviewAsData: true});
    }
    var instance = inputEle.fileinput(options);
    (function(instance) {
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader) {
        util.post('/media', {data: reader.result}, function(res) {
          var previous = [];
          if(targetEle.val().length > 0){
            previous = JSON.parse(targetEle.val());
          }
          previous.push(res.data.file);
          targetEle.val(JSON.stringify(previous));
          _addAudioGroup(template);
        });
      });
      instance.off('filesuccessremove').on('filesuccessremove', function(e, key) {
        // TODO delete targetEle array
      });
    })(instance);
  };

  var _initRecorder = function(controlEle, playerEle, targetEle) {
    $.getScript('js/WebAudioRecorder.min.js', function() {
      (function(controlEle, playerEle, targetEle) {
        var init = false;
        var recording = false;
        var audioContext, input, recorder;
        controlEle.on('click', function() {
          if (!init) {
            navigator.getUserMedia({audio: true}, function(stream) {
              audioContext = new AudioContext();
              input = audioContext.createMediaStreamSource(stream);
              recorder = new WebAudioRecorder(input, {
                workerDir: 'js/',
                encoding: 'mp3',
                options: {
                  encodeAfterRecord: true
                }
              });
              recorder.onComplete = function(rec, blob) {
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                  targetEle.val(reader.result);
                  playerEle.html(`<audio controls>
                    <source src="${URL.createObjectURL(blob)}" type="audio/mpeg">
                  </audio>`).removeClass('hidden');
                }
              };
              record(recorder);
              init = true;
            }, function(e) {
              alert('Could not provide recording feature. Please make sure you have connected the microphone to this device.');
            });
          } else {
            record(recorder);
          }
        });
        var record = function(recorder) {
          if (recording) {
            recorder.finishRecording();
            controlEle.text('Record');
            recording = false;
          } else {
            recorder.startRecording();
            controlEle.text('Stop');
            targetEle.val('');
            playerEle.text('').addClass('hidden');
            recording = true;
          }
        }
      })(controlEle, playerEle, targetEle);
    });
  };

  var _addAudioGroup = function(template) {
    var instance = $(`<div class="recorder">
      <button type="button" class="btn btn-default audioRecorderControl">Record</button>
      <textarea name="audio_audio[]" class="hidden"></textarea>
      <div class="lbRecorder"></div>
    </div>`);
    template.find('.audio_group').append(instance);
    _initRecorder(
      instance.find('button.audioRecorderControl'),
      instance.find('div.lbRecorder'),
      instance.find('textarea[name="audio_audio[]"]')
    );
    return instance;
  };

  return AudioAdapter;
});
