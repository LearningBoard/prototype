$(document).ready(function(){
  $('#boardTitle').on('keydown', function(e){
    $('#boardTitleCount').text(150 - $(this).val().length);
  });
  $('select[name=category]').on('change', function(e){
    $('#headingTwo a').text(this.value);
  });
  $('input[name=contentLevel]').on('change', function(e){
    var level;
    switch(parseInt(this.value)){
      case 0:
        level = 'Beginner';
        break;
      case 1:
        level = 'Intermediate';
        break;
      case 2:
        level = 'Advanced';
        break;
    }
    $('#headingThree a').text(level);
  });
  $('.tagList ul li span').on('click', function(e){
    var $this = $(this).parent();
    $this.fadeOut('slow', function(){
      $this.remove();
    });
  });
  $('#addTagModal').on('show.bs.modal', function(e){
    var modal = $(this);
    modal.find('.modal-footer button:eq(1)').on('click', function(e){
      var tag = modal.find('.modal-body input[name=tag]').val();
      $('.tagList ul').append(`<li>${tag} <span>x</span></li>`);
      $('#addTagModal').modal('hide');
    });
  });
  $('button.addActivityBtn').on('click', function(e){
    e.preventDefault();
    var data = $(this).parent().serializeArray();
    var dataObject = {};
    for(var i = 0; i < data.length; i++){
      dataObject[data[i].name] = data[i].value;
    }
    var htmlPeddingToInsert = '';
    switch(dataObject['type']){
      case 'video':
        htmlPeddingToInsert = `
        <div class="activity">
          <h4>01</h4>
          <div class="row">
            <div class="col-md-4">
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="${dataObject['video_link']}" allowfullscreen></iframe>
              </div>
            </div>
            <div class="col-md-offset-1 col-md-7">
              <p class="lead">${dataObject['video_title']}</p>
              <p>${dataObject['video_description']}</p>
            </div>
          </div>
          <div class="control">
            <ul>
              <li><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></li>
              <li><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></li>
              <li><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>
            </ul>
          </div>
        </div>`;
        break;
      case 'text':
        htmlPeddingToInsert = `
        <div class="activity">
          <h4>01</h4>
          <div class="row">
            <div class="col-md-12">
              <p class="lead">${dataObject['text_title']}</p>
              <p>${dataObject['text_text']}</p>
            </div>
          </div>
          <div class="control">
            <ul>
              <li><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></li>
              <li><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></li>
              <li><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>
            </ul>
          </div>
        </div>`;
        break;
    }
    $('.activityList').append(htmlPeddingToInsert);
    $(this).parent()[0].reset();
  });
  $(document).on('click', '.activity span.glyphicon-remove', function(e){
    var $this = $(this).parents('div.activity');
    $this.fadeOut('slow', function(){
      $this.remove();
    });
  });
});
