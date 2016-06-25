
var pk;
var cover_img;
var tag_list = [];
var activity_list = [];

$.getScript("js/lib.js");
// handler for board cover image
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
  // load category data
  $.get(serv_addr+'category/getAll/', function(data){
    for(var i = 0; i < data.category.length; i++){
      $('select[name=category]').append(`<option value="${data.category[i].id}">${data.category[i].name}</option>`)
    }
  });

  // reset data for new board
  if(location.search.includes('?new')){
    $('form.addBoardForm input[name=title], form.addBoardForm textarea[name=description]').val('').trigger('keydown');
    $('.tagList ul').text('');
    $('.navbar-nav li:not(:first) a').css({
      color: '#CCC',
      cursor: 'not-allowed'
    });
  }

  // assign value to field when editing the board
  if(/\?\d+/.test(location.search)){
    pk = location.search.replace('?', '');
    $.get(serv_addr+'lb/get/'+pk+'/', function(data){
      if(data.board.status == 'PB'){
        $('.publishBoardBtn').parent().addClass('hidden');
        $('.unpublishBoardBtn').parent().removeClass('hidden');
      }
      if(data.tag){
        data.tag.map(function(item){
          tag_list.push(item.id);
          $('.tagList ul').append(`<li data-id="${item.id}">${item.tag} <span>x</span></li>`);
        });
      }
      $('form.addBoardForm input[name=title]').val(data.board.title).trigger('keydown');
      $('form.addBoardForm textarea[name=description]').val(data.board.description);
      $('form.addBoardForm input[name=contentLevel][value='+data.board.level+']').prop('checked', true);
      if(data.activity && data.activity.length > 0){
        $('.activityList .noActivity').hide();
        for(var i = 0; i < data.activity.length; i++){
          $('.activityList').append(renderActivity(data.activity[i].id, $.extend(data.activity[i], JSON.parse(data.activity[i].data))));
        }
      }
      $('.navbar-nav li:not(:first) a').css({});
    }).fail(function(){
      alert('Learning Board not found');
      location.href = 'boards.html';
    });
  }

  // board title word count
  $('#boardTitle').on('keydown', function(e){
    $('#boardTitleCount').text(150 - $(this).val().length);
  });

  // tag remove
  $(document).on('click', '.tagList ul li span', function(e){
    var $this = $(this).parent();
    $this.fadeOut('fast', function(){
      $this.remove();
      tag_list.splice(tag_list.indexOf($this.data('id')), 1);
    });
  });

  // tag add modal
  $('#addTagModal').on('shown.bs.modal', function(e){
    var modal = $(this);
    modal.find('.modal-footer button:eq(1)').off('click').on('click', function(e){
      e.preventDefault();
      var tag = modal.find('.modal-body input[name=tag]');
      $.post(serv_addr+'tag/add/', {tag: tag.val()}, function(data){
        console.log(data);
        if(tag_list.indexOf(data.pk) === -1){
          tag_list.push(data.pk);
          $('.tagList ul').append(`<li data-id="${data.pk}">${tag.val()} <span>x</span></li>`);
        }
        $('#addTagModal').modal('hide');
        tag.val('');
      });
    });
  });

  // save board
  $('a.addBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    var dataObject = $('form.addBoardForm').serializeObject();
    if(cover_img){
      dataObject.cover_img = cover_img;
    }
    if(tag_list){
      dataObject.tag_list = tag_list;
    }
    if(activity_list){
      dataObject.activity_list = activity_list;
    }
    if(pk){
      $.post(serv_addr+'lb/edit/'+pk+'/', dataObject, function(data)
      {
        console.log(data);
        alert('Board saved');
      })
    }else{
      dataObject['author_id'] = localStorage['user_id']
      $.post(serv_addr+'lb/add/', dataObject, function(data)
      {
        console.log(data);
        location.href = 'board_edit.html?' + data.pk;
      })
    }
  })

  // delete board
  $('a.deleteBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    if(!pk) return false;
    var r = confirm('Are you sure to delete the board?');
    if(r){
      $.post(serv_addr+'lb/delete/'+pk+'/', function(data)
      {
        alert('Board deleted');
        location.href = 'boards.html';
      })
    }
  })

  // publish board
  $('a.publishBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    if(!pk) return false;
    $.post(serv_addr+'lb/publish/'+pk+'/', function(data)
    {
      $('.publishBoardBtn').parent().addClass('hidden');
      $('.unpublishBoardBtn').parent().removeClass('hidden');
      alert('Board published');
    })
  })

  // unpublish board
  $('a.unpublishBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    if(!pk) return false;
    $.post(serv_addr+'lb/unpublish/'+pk+'/', function(data)
    {
      $('.publishBoardBtn').parent().removeClass('hidden');
      $('.unpublishBoardBtn').parent().addClass('hidden');
      alert('Board unpublished');
    })
  })

  // add activity submit button
  $('button.addActivityBtn').on('click', function(e){
    e.preventDefault();
    var $this = $(this);

    var dataObject = $(this).parents('form.addActivityForm').serializeObject();
    if(pk){
      dataObject.pk = pk;
    }
    console.log(dataObject);
    if(dataObject.activity_id){ // edit existing activity
      $.post(serv_addr+'activity/edit/'+dataObject.activity_id+'/', dataObject, function(data)
      {
        $(this).parents('form.addActivityForm').find('input[name=activity_id]').val('');
        var prevDom = $('.activityList .activity [data-id='+dataObject.activity_id+']').parents('.activity');
        prevDom.replaceWith(renderActivity(data.pk, dataObject));
        $this.parent()[0].reset();
        $this.parent().find('input[name=activity_id]').val('');
      });
    }else{ // add new activity
      $.post(serv_addr+'activity/add/', dataObject, function(data)
      {
        console.log(data);
        activity_list.push(data.pk);

        $('.activityList .noActivity').hide();
        $('.activityList').append(renderActivity(data.pk, dataObject));
        $this.parent()[0].reset();
      });
    }
  });

  // unpublish activity
  $(document).on('click', '.activity span.glyphicon-floppy-remove', function(e){
    var $this = $(this).parents('div.activity');
    var $thisBtn = $(this);
    var id = $(this).parents('div.control').data('id');
    $.post(serv_addr+'activity/unpublish/'+id+'/', function(data)
    {
      $this.addClass('unpublish');
      $thisBtn.parent().addClass('hidden');
      $thisBtn.parent().next().removeClass('hidden');
    });
  });

  // publish activity
  $(document).on('click', '.activity span.glyphicon-floppy-saved', function(e){
    var $this = $(this).parents('div.activity');
    var $thisBtn = $(this);
    var id = $(this).parents('div.control').data('id');
    $.post(serv_addr+'activity/publish/'+id+'/', function(data)
    {
      $this.removeClass('unpublish');
      $thisBtn.parent().addClass('hidden');
      $thisBtn.parent().prev().removeClass('hidden');
    });
  });

  // edit activity
  $(document).on('click', '.activity span.glyphicon-pencil', function(e){
    var $this = $(this).parents('div.activity');
    var id = $(this).parents('div.control').data('id');
    $.get(serv_addr+'activity/get/'+id+'/', function(data)
    {
      $('#collapseAddActivity').collapse('show');
      $('#activityTab a[href="#'+data.type+'"]').tab('show');
      var targetForm = $('#collapseAddActivity #' + data.type);
      targetForm.find('.addActivityForm input[name=activity_id]').val(data.id);
      targetForm.find('input[name=title]').val(data.title);
      targetForm.find('textarea[name=description]').val(data.description);
      data = JSON.parse(data.data);
      for(var key in data){
        targetForm.find('[name='+key+']').val(data[key]);
      }
    });
  });

  // remove activity
  $(document).on('click', '.activity span.glyphicon-remove', function(e){
    var $this = $(this).parents('div.activity');
    var r = confirm('Are you sure to delete this activity?');
    if(r){
      var id = $(this).parents('div.control').data('id');
      $.post(serv_addr+'activity/delete/'+id+'/', function(data)
      {
        activity_list.splice(activity_list.indexOf(parseInt(id)), 1);
        $this.fadeOut('slow', function(){
          $this.remove();
          if($('.activityList .activity').length < 1){
            $('.activityList .noActivity').fadeIn('fast');
          }
        });
      });
    }
  });
});

function renderActivity(pk, dataObject){
	console.log(dataObject);
  var html;
  var activityControl = `
  <div class="control" data-id="${pk}">
    <ul>
      <li ${dataObject['status'] == 'UP' ? 'class="hidden"' : ''}><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></li>
      <li ${dataObject['status'] == 'UP' ? '' : 'class="hidden"'}><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span></li>
      <li><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></li>
      <li><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>
    </ul>
  </div>`;
  switch(dataObject['type']){
    case 'video':
      // handle different links
      if(dataObject['video_link'] && dataObject['video_link'].match(/watch\?v=(.*)/) != null){
        dataObject['video_link'] = 'https://www.youtube.com/embed/' + dataObject['video_link'].match(/watch\?v=(.*)/)[1];
      }
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
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
        ${activityControl}
      </div>`;
      break;
    case 'text':
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
        <h4>01</h4>
        <div class="row">
          <div class="col-md-12">
            <p class="lead">${dataObject['title']}</p>
            <p>${dataObject['description']}</p>
          </div>
        </div>
        ${activityControl}
      </div>`;
      break;
    default:
      html = `
      <div class="activity">
        <h4>01</h4>
        <p><i>Error occur when rending activity</i></p>
      </div>`;
  }
  return html;
}
