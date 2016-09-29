define(['util', 'temps/Template', 'models/Audio', 'videojs'], function(util, Template, Audio, videojs) {
  "use strict";

  var playbackRates = [2, 1.5, 1.25, 1, 0.5];

  var AudioTemplate = function(audio, parent) {
    this.parentModel = parent;
    this.model = new Audio(audio);

    var thisArg = this;
    var images = this.model.audio_image;
    var audios = this.model.audio_audio;

    var $html = $(`
      <div>
        <div id="audioViewCarousel" class="carousel slide" data-ride="carousel" data-interval="false">
          <!-- Wrapper for slides -->
          <div class="carousel-inner" role="listbox"></div>

          <!-- Controls -->
          <a class="left carousel-control" role="button" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="right carousel-control" role="button" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
        <div class="audioViewPlayer text-center" style="margin-top:10px;"></div>
      </div>`);

    var itemHtml = '';
    images.forEach(function(item, i) {
      if (audios[i]) {
        var setupObj = {
          poster: util.urls.media_addr + '/' + item,
          playbackRates: playbackRates,
          sources: [
            {
              type: 'audio/mpeg',
              src: audios[i]
            }
          ]
        };
        itemHtml += `
        <div class="item ${i === 0 ? 'active' : ''}">
          <audio
            id="aid${thisArg.parentModel.id}-${i}-${new Date().getTime()}"
            class="video-js vjs-default-skin"
            preload="auto"
            controls
            height="400"
            data-setup='${JSON.stringify(setupObj)}'>
          </audio>
        </div>`;
      } else {
        itemHtml += `
        <div class="item ${i === 0 ? 'active' : ''}">
          <img src="${util.urls.media_addr}/${item}" alt="" class="img-responsive" />
        </div>`;
      }
    });
    $html.find('.carousel-inner').append(itemHtml);

    $html.find('.left').on('click', function() {
      $('#audioViewCarousel').carousel('prev');
    });
    $html.find('.right').on('click', function() {
      $('#audioViewCarousel').carousel('next');
    });
    Template.call(this, $html);
  };

  $.extend(AudioTemplate.prototype, Template.prototype);

  AudioTemplate.prototype.display = function() {
    Template.prototype.display.apply(this, arguments);
    var audio_tag = this.$template.find('.carousel-inner .item audio');
    audio_tag.each(function(i, item) {
      var instance = videojs(item);
    });
  };

  return AudioTemplate;

});
