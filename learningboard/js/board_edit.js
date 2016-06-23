
$.getScript("js/lib.js");
$.getScript('https://cdn.jsdelivr.net/bootstrap.fileinput/4.3.2/js/fileinput.min.js', function(){
  $(document).ready(function(){
    $(".uploadImage").fileinput({
      overwriteInitial: true,
      showClose: false,
      showCaption: false,
      showBrowse: false,
      showRemove: false,
      browseOnZoneClick: true,
      defaultPreviewContent: `<img src="https://placehold.it/300x200" alt="Your Avatar" class="img-responsive">
      <h6 class="text-muted text-center">Click to select cover image</h6>`,
      layoutTemplates: {main2: '{preview} {remove} {browse}'},
      allowedFileExtensions: ['jpg', 'png', 'gif']
    });
  });
});

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
  $(document).on('click', '.tagList ul li span', function(e){
    var $this = $(this).parent();
    $this.fadeOut('slow', function(){
      $this.remove();
    });
  });
  $('#addTagModal').on('show.bs.modal', function(e){
    var modal = $(this);
    modal.find('.modal-footer button:eq(1)').on('click', function(e){
      var tag = modal.find('.modal-body input[name=tag]');
      $('.tagList ul').append(`<li>${tag.val()} <span>x</span></li>`);
      $('#addTagModal').modal('hide');
      tag.val('');
    });
  });
  $('button.addBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    var dataObject = $('form.addBoardForm').serializeObject();
    $.post(serv_addr+'lb/add/', dataObject, function(data)
    {
      console.log(data);
    })
  })
  $('button.addActivityBtn').on('click', function(e){
    e.preventDefault();
    var data = $(this).parent().serializeArray();
    var dataObject = {};
    for(var i = 0; i < data.length; i++){
      dataObject[data[i].name] = data[i].value;
    }
    var htmlPeddingToInsert = '';

    var o = $('form.addActivityForm').serializeObject();
    console.log(o);
    $.post(serv_addr+'act/add/', o, function(data)
      {
        alert(data);
      });

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
    // ajax send to backend
    $('.activityList').append(htmlPeddingToInsert);
    $(this).parent()[0].reset();
  });
  $(document).on('click', '.activity span.glyphicon-floppy-remove', function(e){
    var $this = $(this).parents('div.activity');
    $this.css('background-color', '#EEE');
    // ajax unpublish activity id
  });
  $(document).on('click', '.activity span.glyphicon-pencil', function(e){
    var $this = $(this).parents('div.activity');
    // ajax get latest data by id
  });
  $(document).on('click', '.activity span.glyphicon-remove', function(e){
    var $this = $(this).parents('div.activity');
    $this.fadeOut('slow', function(){
      // ajax delete activity id
      $this.remove();
    });
  });
});
