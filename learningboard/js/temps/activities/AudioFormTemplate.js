define(['../ActivityFormTemplate', 'util', 'fileinput'], function(ActivityFormTemplate, util) {
  'use strict';

  var AudioFormTemplate = function(data) {
    ActivityFormTemplate.call(this, 'Audio', 'audio');

    var customFormHtml = `
    <label class="control-label">Select File</label>
    <input id="${this.type}_image_placeholder" type="file" class="file-loading" multiple>
    <textarea name="${this.type}_image" class="hidden"></textarea>
    <div class="form-group">
      <label for="${this.type}_audio">Audio</label>
      <div class="${this.type}_group"></div>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);

    if (!data) {
      _initAudioActivity(
        this.$template,
        this.$template.find(`#${this.type}_image_placeholder`),
        this.$template.find(`textarea[name=${this.type}_image]`),
        true,
        null
      );
    } else {
      _initAudioActivity(
        this.$template,
        this.$template.find(`#${this.type}_image_placeholder`),
        this.$template.find(`textarea[name=${this.type}_image]`),
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
    }
  };

  $.extend(AudioFormTemplate.prototype, ActivityFormTemplate.prototype);

  AudioFormTemplate.prototype.reset = function() {
    ActivityFormTemplate.prototype.reset.call(this);
    _initAudioActivity(
      this.$template,
      this.$template.find(`#${this.type}_image_placeholder`),
      this.$template.find(`textarea[name=${this.type}_image]`),
      true,
      null
    );
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
      defaultPreviewContent: `<div align="center"><img src="img/placeholder-no-image.png" alt="Image" width="300" class="img-responsive">
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

  return AudioFormTemplate;
});
