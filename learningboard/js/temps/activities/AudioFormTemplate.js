define(['../ActivityFormTemplate', 'util', 'fileinput', 'webrtcpolyfill', 'WebAudioRecorder.min'], function(ActivityFormTemplate, util) {
  'use strict';

  var AudioFormTemplate = function(data) {
    ActivityFormTemplate.call(this, 'Audio', 'audio');

    this.dataObj = [];
    this.recorderInstance = {};

    var customFormHtml = `
    <label class="control-label">Images<span class="text-danger">*</span> (Allows to record audio per image after upload)</label>
    <input id="${this.type}_image_placeholder" type="file" class="file-loading" accept="image/*" multiple>
    <div><span class="help-block"></span></div>
    <div class="playerArea hidden"></div>`;
    this.$template.find('.customForm').append(customFormHtml);

    _initAudioActivity(this, null);
  };

  $.extend(AudioFormTemplate.prototype, ActivityFormTemplate.prototype);

  AudioFormTemplate.prototype.reset = function() {
    ActivityFormTemplate.prototype.reset.call(this);
    this.dataObj = [];
    this.recorderInstance = {};
    _initAudioActivity(this, null);
    this.$template.find('.playerArea').empty();
  };

  AudioFormTemplate.prototype.setData = function(act) {
    ActivityFormTemplate.prototype.setData.call(this, act);
    var $this = this;
    if (act.data[`${this.type}_image`] && act.data[`${this.type}_audio`]) {
      _initAudioActivity(this, act.data[`${this.type}_image`]);
      act.data[`${this.type}_audio`].forEach(function(item, i) {
        var preview = $this.$template.find(`.file-preview-frame[data-fileindex="init_${i}"]`);
        var id = preview.attr('id');
        if (item) {
          _addAudioGroup($this, id, util.urls.media_addr + '/' + item);
          preview.find('button.kv-file-play').prop('disabled', false);
        }
        $this.dataObj.push({key: id, file: act.data[`${$this.type}_image`][i], audio: item});
      });
    }
  };

  AudioFormTemplate.prototype.isFormDataValid = function() {
    var helpEle = this.$template.find('.help-block');
    // Clear old label
    helpEle.parent('div').removeClass('has-warning');
    helpEle.text('');
    // Start checking
    if (this.dataObj.length < 1) {
      helpEle.parent('div').addClass('has-warning');
      helpEle.text('Audio activity requires at least one image');
      return false;
    }
    return true;
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
      showBrowse: true,
      showRemove: false,
      showUpload: false,
      dropZoneEnabled: false,
      overwriteInitial: false,
      browseLabel: 'Browse Images',
      otherActionButtons: `
      <button type="button" class="kv-file-record btn btn-xs btn-default" title="Record Audio">
        <i class="glyphicon glyphicon-record"></i> Record
      </button>
      <button type="button" class="kv-file-play btn btn-xs btn-default" title="Play Audio" disabled>
        <i class="glyphicon glyphicon-play-circle"></i> Play
      </button>`,
      layoutTemplates: {
        footer: `
        <div class="file-thumbnail-footer">
          {actions}
        </div>`,
        actions: `
        <div class="file-actions">
          <div class="file-footer-buttons">
            {zoom} {delete} {other}
          </div>
          <div class="clearfix"></div>
        </div>`,
      },
      previewZoomSettings: {
        image: {width: '', height: 'auto', 'max-width': '100%'}
      },
      allowedFileTypes: ['image']
    };
    if (url) {
      url = url.map(function(value) {
        return util.urls.media_addr + '/' + value;
      });
      $.extend(options, {initialPreview: url, initialPreviewAsData: true});
    }
    var instance = inputEle.fileinput('destroy').fileinput(options);

    // Record audio button
    $this.$template.off('click', '.kv-file-record').on('click', '.kv-file-record', function() {
      var id = $(this).parents('.file-preview-frame').attr('id');
      if ($(this).data('processing')) { // deny action when newly recorded audio is processing
        return false;
      } else if ($(this).data('recording')) { // request to end record
        $this.recorderInstance[id].finishRecording();
      } else { // request to start record
        var thisArg = $(this);
        navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) { // request browser permission
          var audioContext = new AudioContext;
          var input = audioContext.createMediaStreamSource(stream);
          var recorder = new WebAudioRecorder(input, {
            workerDir: 'js/',
            encoding: 'mp3',
            options: {
              encodeAfterRecord: true
            }
          });
          recorder.onEncoderLoaded = function(rec, encoding) { // start recording
            rec.startRecording();
            $this.recorderInstance[id] = rec;
            thisArg.data('recording', true);
            thisArg.html('<span class="text-danger"><i class="fa fa-circle-o-notch fa-spin"></i> Stop record</span>');
            thisArg.next('.kv-file-play').prop('disabled', true);
          };
          recorder.onEncodingProgress = function(rec, progress) { // process after record
            thisArg.data('processing', true);
            thisArg.html('<span class="text-success"><i class="fa fa-circle-o-notch fa-spin"></i> Processing</span>');
          };
          recorder.onComplete = function(rec, blob) { // record is ready to play
            var reader = new FileReader();
            reader.onload = function(e) {
              $this.recorderInstance[id] = undefined;
              _addAudioGroup($this, id, URL.createObjectURL(blob));
              thisArg.next('.kv-file-play').prop('disabled', false);
              util.post('/media', {data: reader.result.replace('audio/mpeg', 'audio/mp3')}, function(res) {
                for (var i = 0; i < $this.dataObj.length; i++) {
                  if ($this.dataObj[i].key == id) {
                    $this.dataObj[i].audio = res.data.file;
                    break;
                  }
                }
                thisArg.data('processing', false);
                thisArg.data('recording', false);
                thisArg.html('<i class="glyphicon glyphicon-record"></i> Record');
              });
            };
            reader.readAsDataURL(blob);
          };
        }, function(e) { // user denied browser to get permission
          alert('Could not provide recording feature. Please make sure you have connected the microphone to this device.');
        });
      }
    });

    // Play audio button
    $this.$template.off('click', '.kv-file-play').on('click', '.kv-file-play', function() {
      var thisArg = $(this);
      var id = $(this).parents('.file-preview-frame').attr('id');
      var audioEle = $('.playerArea').find(`audio[data-id="${id}"]`);
      if (!audioEle[0].paused) {
        $(this).html('<i class="glyphicon glyphicon-play-circle"></i> Play');
        audioEle[0].pause();
      } else {
        $(this).html('<i class="fa fa-pause-circle-o"></i> Pause');
        audioEle[0].play();
      }
      audioEle.off('ended').on('ended', function() {
        thisArg.html('<i class="glyphicon glyphicon-play-circle"></i> Play');
      });
    });

    // Remove image button
    $this.$template.off('click', '.kv-file-remove').on('click', '.kv-file-remove', function() {
      var preview = $(this).parents('.file-preview-frame');
      var id = preview.attr('id');
      for (var i = 0; i < $this.dataObj.length; i++) {
        if ($this.dataObj[i].key == id) {
          $this.dataObj.splice(i, 1);
          break;
        }
      }
      $this.$template.find(`div.playerArea audio[data-id="${id}"]`).remove();
      if ($this.dataObj.length < 1) {
        _initAudioActivity($this, null);
      } else if (preview.data('fileindex').startsWith('init_')) {
        preview.fadeOut('fast', function() {
          $(this).remove();
        });
      }
    });
    // Upload image after select
    instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader) {
      util.post('/media', {data: reader.result}, function(res) {
        $this.dataObj.push({key: previewId, file: res.data.file, audio: ''});
      });
    });

    // Add scrollbar in file zoom in order to fit large images
    instance.off('filezoomshow').on('filezoomshow', function(e, params) {
      params.modal.find('.kv-zoom-body').css('overflow', 'auto');
    });
  };

  // Add hidden player
  var _addAudioGroup = function($this, id, data) {
    $this.$template.find(`div.playerArea audio[data-id="${id}"]`).remove();
    var instance = $(`<audio controls data-id="${id}">
      <source src="${data}" type="audio/mpeg">
    </audio>`);
    $this.$template.find('div.playerArea').append(instance);
  };

  return AudioFormTemplate;
});
