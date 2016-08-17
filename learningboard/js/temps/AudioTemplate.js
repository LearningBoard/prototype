define(['util', 'temps/Template', 'models/Audio'], function(util, Template, Audio) {
  "use strict";

  var AudioTemplate = function(audio, parent) {
    this.parentModel = parent;
    this.model = new Audio(audio);

    var images = this.model.audio_image;
    var audios = this.model.audio_audio;

    var $html;

    if (images.length < 1) {
      $html = $('');
    } else {
      $html = $(`
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

      var imageHtml = '';
      images.forEach(function(item, i) {
        imageHtml += `
        <div class="item ${i === 0 ? 'active' : ''}">
          <img src="${util.urls.media_addr}/${item}" alt="" class="img-responsive" />
        </div>`;
      });
      $html.find('.carousel-inner').append(imageHtml);

      var audioHtml = '';
      audios.forEach(function(item, i) {
        audioHtml += `
        <div class="${i === 0 ? '' : 'hidden'}">
          <audio controls>
            <source src="${item}" type="audio/mpeg">
          </audio>
        </div>`;
      });
      $html.find('.audioViewPlayer').append(audioHtml);

      // events
      $html.find('.carousel').on('slide.bs.carousel', function (e) {
        var currentAudio = $html.find('.audioViewPlayer > div:visible');
        if (e.direction == 'left') { // next
          if (currentAudio.next('div').length > 0) {
            currentAudio.addClass('hidden');
            currentAudio.next('div').removeClass('hidden');
          } else {
            currentAudio.addClass('hidden');
            currentAudio.parent('.audioViewPlayer').find('div:first').removeClass('hidden');
          }
        } else { //prev
          if (currentAudio.prev('div').length > 0) {
            currentAudio.addClass('hidden');
            currentAudio.prev('div').removeClass('hidden');
          } else {
            currentAudio.addClass('hidden');
            currentAudio.parent('.audioViewPlayer').find('div:last').removeClass('hidden');
          }
        }
      });
      $html.find('.left').on('click', function() {
        $('#audioViewCarousel').carousel('prev');
      });
      $html.find('.right').on('click', function() {
        $('#audioViewCarousel').carousel('next');
      });
    }
    Template.call(this, $html);
  };

  $.extend(AudioTemplate.prototype, Template.prototype);

  return AudioTemplate;

});
