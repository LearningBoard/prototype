
var cover_img;

$.getScript("js/lib.js");
$.getScript('https://cdn.jsdelivr.net/bootstrap.fileinput/4.3.2/js/fileinput.min.js', function(){
  $(document).ready(function(){
    $('.uploadImage').fileinput({
      overwriteInitial: true,
      showClose: false,
      showCaption: false,
      showBrowse: false,
      browseOnZoneClick: true,
      removeLabel: 'Remove cover image',
      removeClass: 'btn btn-default btn-block btn-xs',
      defaultPreviewContent: `<img src="https://placehold.it/300x200" alt="Your Avatar" class="img-responsive">
      <h6 class="text-muted text-center">Click to select cover image</h6>`,
      layoutTemplates: {main2: '{preview} {remove}'},
      allowedFileExtensions: ['jpg', 'png', 'gif']
    });
    $('.uploadImage').on('fileloaded', function(e, file, previewId, index, reader){
      cover_img = reader.result;
    });
    $('.uploadImage').on('filecleared', function(e){
      cover_img = undefined;
    });
  });
});

$(document).ready(function(){
  // reset data for new boardTitle
  if(location.search.includes('?new')){
    $('form.addBoardForm input[name=title], form.addBoardForm textarea[name=description]').val('').trigger('keydown');
    $('.tagList ul, .activityList').text('');
    $('.navbar-nav li:not(:first) a').css({
      color: '#CCC',
      cursor: 'not-allowed'
    });
  }

  // assign pk to hidden field when editing the board
  if(/\?\d+/.test(location.search)){
    var pk = location.search.replace('?', '');
    $('form.addBoardForm input[name=pk]').val(pk);
    $.get(serv_addr+'lb/get/'+pk+'/', function(data){
      $('form.addBoardForm input[name=title]').val(data.title).trigger('keydown');
      $('form.addBoardForm textarea[name=description]').val(data.description);
      $('.navbar-nav li:not(:first) a').css({});
    }).fail(function(){
      alert('Learning Board not found');
      location.href = 'boards.html';
    });
  }

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
  $('a.addBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    var dataObject = $('form.addBoardForm').serializeObject();
    if(cover_img){
      dataObject.cover_img = cover_img;
    }
    if($('form.addBoardForm input[name=pk]').val()){
      $.post(serv_addr+'lb/edit/', dataObject, function(data)
      {
        console.log(data);
        alert('Board saved');
      })
    }else{
      $.post(serv_addr+'lb/add/', dataObject, function(data)
      {
        console.log(data);
        location.href = 'board_edit.html?' + data.pk;
      })
    }
  })
  $('a.deleteBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    var r = confirm('Are you sure to delete the board?');
    if(r){
      $.post(serv_addr+'lb/delete/'+$('form.addBoardForm input[name=pk]').val()+'/', function(data)
      {
        alert('Board deleted');
        location.href = 'boards.html';
      })
    }
  })
  $('button.addActivityBtn').on('click', function(e){
    e.preventDefault();
    var htmlPeddingToInsert = '';

    var dataObject = $(this).parents('form.addActivityForm').serializeObject();
    if($('form.addBoardForm input[name=pk]').val()){
      dataObject.pk = $('form.addBoardForm input[name=pk]').val();
    }
    console.log(dataObject);
    $.post(serv_addr+'activity/add/', dataObject, function(data)
      {
        console.log(data);
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
              <p class="lead">${dataObject['title']}</p>
              <p>${dataObject['description']}</p>
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
              <p class="lead">${dataObject['title']}</p>
              <p>${dataObject['description']}</p>
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
    $this.css('background', 'url(data:image/gif;base64,R0lGODlhFAAUAIAAAMDAwP///yH5BAEAAAEALAAAAAAUABQAAAImhI+pwe3vAJxQ0hssnnq/7jVgmJGfGaGiyoyh68GbjNGXTeEcGxQAOw==)');
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
