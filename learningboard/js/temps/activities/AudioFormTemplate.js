define(['../ActivityFormTemplate', 'util', 'fileinput'], function(ActivityFormTemplate, util) {
  'use strict';

  var AudioFormTemplate = function(data) {
    ActivityFormTemplate.call(this, 'Audio', 'audio');

    this.dataObj = [];

    var customFormHtml = `
    <label class="control-label">Select File</label>
    <input id="${this.type}_image_placeholder" type="file" class="file-loading" multiple>
    <div class="form-group">
      <label for="${this.type}_audio">Audio</label>
      <p>Please upload at least one image before recording</p>
      <div class="${this.type}_group"></div>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);

    _initAudioActivity(this, null);
  };

  $.extend(AudioFormTemplate.prototype, ActivityFormTemplate.prototype);

  AudioFormTemplate.prototype.reset = function() {
    ActivityFormTemplate.prototype.reset.call(this);
    this.dataObj = [];
    _initAudioActivity(this, null);
    this.$template.find('.audio_group').empty();
  };

  AudioFormTemplate.prototype.setData = function(act) {
    ActivityFormTemplate.prototype.setData.call(this, act);
    var $this = this;
    if (act.data[`${this.type}_image`] && act.data[`${this.type}_audio`]) {
      _initAudioActivity(this, act.data[`${this.type}_image`]);
      act.data[`${this.type}_audio`].forEach(function(item, i) {
        var instance = _addAudioGroup($this, i);
        instance.find('div.lbRecorder').html(`
          <audio controls>
            <source src="${item}" type="audio/mpeg">
          </audio>`).removeClass('hidden');
          $this.dataObj.push({key: i, file: act.data[`${$this.type}_image`][i], audio: item});
      });
    }
  };

  AudioFormTemplate.prototype.serializeObject = function() {
    var data = ActivityFormTemplate.prototype.serializeObject.call(this);
    var image = [];
    var audio = [];
    this.dataObj.forEach(function(item) {
      image.push(item.file || '');
      audio.push(item.audio || '');
    });
    data.audio_image = image;
    data.audio_audio = audio;
    return data;
  }

  var _initAudioActivity = function($this, url) {
    var inputEle = $this.$template.find(`#${$this.type}_image_placeholder`);
    var options = {
      uploadUrl: util.serv_addr + '/media', // force display drag zone
      showClose: false,
      showCaption: false,
      showBrowse: false,
      showRemove: false,
      showUpload: false,
      browseOnZoneClick: true,
      overwriteInitial: false,
      layoutTemplates: {
        footer: `
        <div class="file-thumbnail-footer">
          {progress} {actions}
        </div>`,
        actions: `
        <div class="file-actions">
          <div class="file-footer-buttons">
            {delete} {other}
          </div>
          <div class="clearfix"></div>
        </div>`,
      }
    };
    if (url) {
      url = url.map(function(value) {
        return util.urls.media_addr + '/' + value;
      });
      $.extend(options, {initialPreview: url, initialPreviewAsData: true});
    }
    var instance = inputEle.fileinput('destroy').fileinput(options);
    (function(instance) {
      $(document).off('click', '.kv-file-remove').on('click', '.kv-file-remove', function() {
        var idEle = $(this).parents('.file-preview-frame');
        var id;
        var isInit = false;
        if (idEle.hasClass('file-preview-initial')) {
          id = idEle.data('fileindex').replace('init_', '');
          isInit = true;
        } else {
          id = idEle.attr('id');
        }
        for (var i = 0; i < $this.dataObj.length; i++) {
          if ($this.dataObj[i].key == id) {
            $this.dataObj.splice(i, 1);
            break;
          }
        }
        $this.$template.find(`.recorder[data-id="${id}"]`).fadeOut('fast', function(e) {
          $(this).remove();
        });
        if (isInit) {
          idEle.remove();
          if ($this.dataObj.length < 1) {
            _initAudioActivity($this, null);
          }
        }
      });
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader) {
        util.post('/media', {data: reader.result}, function(res) {
          $this.dataObj.push({key: previewId, file: res.data.file, audio: ''});
          _addAudioGroup($this, previewId);
        });
      });
    })(instance);
  };

  var _initRecorder = function($this, instance) {
    $.getScript('js/WebAudioRecorder.min.js', function() {
      (function($this, instance) {
        var init = false;
        var recording = false;
        var audioContext, input, recorder;
        var controlEle = instance.find('button.audioRecorderControl');
        var playerEle = instance.find('div.lbRecorder');
        var id = instance.data('id');
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
                  for (var i = 0; i < $this.dataObj.length; i++) {
                    if ($this.dataObj[i].key == id) {
                      $this.dataObj[i].audio = reader.result;
                      break;
                    }
                  }
                  playerEle.html(`<audio controls>
                    <source src="${URL.createObjectURL(blob)}" type="audio/mpeg">
                  </audio>`).removeClass('hidden');
                }
              };
              record(recorder, id);
              init = true;
            }, function(e) {
              alert('Could not provide recording feature. Please make sure you have connected the microphone to this device.');
            });
          } else {
            record(recorder, id);
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
            for (var i = 0; i < $this.dataObj.length; i++) {
              if ($this.dataObj[i].key == id) {
                delete $this.dataObj[i].audio;
                break;
              }
            }
            playerEle.text('').addClass('hidden');
            recording = true;
          }
        }
      })($this, instance);
    });
  };

  var _addAudioGroup = function($this, id) {
    var instance = $(`<div class="recorder" data-id="${id}">
      <button type="button" class="btn btn-default audioRecorderControl">Record</button>
      <div class="lbRecorder"></div>
    </div>`);
    $this.$template.find('.audio_group').append(instance);
    _initRecorder($this, instance);
    return instance;
  };

  return AudioFormTemplate;
});
