
var pk;
var cover_img = 'empty';
var tag_list = [];
var activity_list = [];
var activity_index = 0;

$.getScript("js/lib.js");
$.getScript('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js');
$.getCSS('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css');

$(document).ready(function(){
  // load category data
  $.get(serv_addr+'/category/getAll/', function(data){
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
    initCoverImage('https://placehold.it/300x200');
  }

  // assign value to field when editing the board
  if(/\?\d+/.test(location.search)){
    pk = location.search.replace('?', '');
    $.get(serv_addr+'/lb/get/'+pk+'/', function(data){
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
      if(data.board.activities && data.board.activities.length > 0){
        $('.activityList .noActivity').hide();
        for(var i = 0; i < data.board.activities.length; i++){
          $('.activityList').append(renderActivity(++activity_index, data.board.activities[i].id, $.extend(data.board.activities[i], JSON.parse(data.board.activities[i].data))));
        }
      }
      $('.navbar-nav li:not(:first) a').css({});
      initCoverImage(data.board.image_url ? serv_addr + data.board.image_url: data.board.image.length);
    }).fail(function(){
      alert('Learning Board not found');
      location.href = 'boards.html';
    });
  }

  // init WYSIWYG
  initCkeditor();

  // init image input
  initImageInput($('#text_image_placeholder'), $('#text .addActivityForm textarea[name=text_image]'), 'https://placehold.it/300x200');

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
    var tag = modal.find('.modal-body select[name=tag]');
    $.get(serv_addr + '/tag/getAll/', function(data){
      data = $.map(data.tags, function(item){
        return {
          id: item.tag,
          text: item.tag
        }
      });
      tag.select2({
        placeholder: 'Enter or search tag',
        multiple: true,
        tags: true,
        data: data,
        minimumInputLength: 1
      });
    });
    modal.find('.modal-footer button:eq(1)').off('click').on('click', function(e){
      e.preventDefault();
      var tagArray = tag.val();
      if(tagArray.length > 0){
        for(var i = 0; i < tagArray.length; i++){
          var item = tagArray[i];
          $.post(serv_addr+'/tag/add/', {tag: item}, function(data){
            if(tag_list.indexOf(data.pk) === -1){
              tag_list.push(data.pk);
              $('.tagList ul').append(`<li data-id="${data.pk}">${item} <span>x</span></li>`);
            }
          });
        }
      }
      $('#addTagModal').modal('hide');
      tag.select2('val', '');
    });
  });

  // save board
  $('a.addBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    // trigger html5 validation
    if(!$('form.addBoardForm')[0].checkValidity()){
      $('form.addBoardForm button[type=submit]').trigger('click');
      return;
    }
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
      $.post(serv_addr+'/lb/edit/'+pk+'/', dataObject, function(data)
      {
        console.log(data);
        alert('Board saved');
      })
    }else{
      dataObject['author_id'] = localStorage['user_id'];
      $.post(serv_addr+'/lb/add/', dataObject, function(data)
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
      $.post(serv_addr+'/lb/delete/'+pk+'/', function(data)
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
    $.post(serv_addr+'/lb/publish/'+pk+'/', function(data)
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
    $.post(serv_addr+'/lb/unpublish/'+pk+'/', function(data)
    {
      $('.publishBoardBtn').parent().removeClass('hidden');
      $('.unpublishBoardBtn').parent().addClass('hidden');
      alert('Board unpublished');
    })
  })

  // preview board
  $('a.previewBoardBtn').on('click', function(e)
  {
    e.preventDefault();
    if(!pk) return false;
    window.open('board_view.html?' + pk,'_blank');
  });

  // add activity collapse
  $('#collapseAddActivity').on('show.bs.collapse', function(e){
    $('#addActivityBox .panel-title a').text('- Add/Edit Learning Activity');
  });

  $('#collapseAddActivity').on('hide.bs.collapse', function(e){
    $('#addActivityBox .panel-title a').text('+ Add/Edit Learning Activity');
  });

  // add activity submit button
  $('button.addActivityBtn').on('click', function(e){
    // trigger html5 validation
    if($(this).parents('form.addActivityForm')[0].checkValidity()){
      e.preventDefault();
    }else{
      return;
    }
    var $this = $(this);

    var dataObject = $(this).parents('form.addActivityForm').serializeObject();
    if(pk){
      dataObject.pk = pk;
    }
    console.log(dataObject);
    if(dataObject.activity_id){ // edit existing activity
      dataObject.order = $('.activityList .activity').index($('.control[data-id='+dataObject.activity_id+']').parents('.activity'));
      $.post(serv_addr+'/activity/edit/'+dataObject.activity_id+'/', dataObject, function(data)
      {
        // clear form data
        CKEDITOR.instances[$this.parents('form.addActivityForm').find('textarea[name=description]').attr('id')].setData('');
        initImageInput($('#text_image_placeholder'), $('#text .addActivityForm textarea[name=text_image]'), 'https://placehold.it/300x200');
        $(this).parents('form.addActivityForm').find('input[name=activity_id]').val('');
        var prevDom = $('.activityList .activity [data-id='+dataObject.activity_id+']').parents('.activity');
        var index = $('.activityList .activity').index(prevDom) + 1;
        prevDom.replaceWith(renderActivity(index, data.pk, dataObject));
        $this.parent().find('.result_msg').text('Activity edited!').delay(1000).fadeOut('fast', function(){
          $(this).text('');
        });
        $this.parent()[0].reset();
        $this.parent().find('input[name=activity_id]').val('');
      });
    }else{ // add new activity
      dataObject.order = $('.activityList .activity').size();
      $.post(serv_addr+'/activity/add/', dataObject, function(data)
      {
        console.log(data);
        activity_list.push(data.pk);

        // clear form data
        CKEDITOR.instances[$this.parents('form.addActivityForm').find('textarea[name=description]').attr('id')].setData('');
        initImageInput($('#text_image_placeholder'), $('#text .addActivityForm textarea[name=text_image]'), 'https://placehold.it/300x200');
        $('.activityList .noActivity').hide();
        $('.activityList').append(renderActivity(++activity_index, data.pk, dataObject));
        $this.parent().find('.result_msg').text('Activity added!').delay(1000).fadeOut('fast', function(){
          $(this).text('');
        });
        $this.parent()[0].reset();
      });
    }
  });

  // sort activity
  $('.activityList').sortable({
    opacity: 0.95,
    cursor: 'move'
  });
  $('.activityList').on('sortupdate', function(e, ui){
    var order = {};
    $('.activityList .activity').each(function(i){
      var newIndexForRender = parseInt(i) + 1;
      $(this).find('h4').text(newIndexForRender < 10 ? '0' + newIndexForRender : newIndexForRender);
      order[$(this).find('.control').data('id')] = i;
    });
    $.post(serv_addr+'/activity/orderchange/', order);
  });

  // lock sort
  $('.sortLockMode').on('click', function(e){
    if($(this).hasClass('active')){
      $(this).removeClass('active').find('span').text('Lock');
      $('.activityList').sortable('enable');
    }else{
      $(this).addClass('active').find('span').text('Unlock');
      $('.activityList').sortable('disable');
    }
  });

  // unpublish activity
  $(document).on('click', '.activity span.glyphicon-floppy-remove', function(e){
    var $this = $(this).parents('div.activity');
    var $thisBtn = $(this);
    var id = $(this).parents('div.control').data('id');
    $.post(serv_addr+'/activity/unpublish/'+id+'/', function(data)
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
    $.post(serv_addr+'/activity/publish/'+id+'/', function(data)
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
    $.get(serv_addr+'/activity/get/'+id+'/', function(data)
    {
      $('#collapseAddActivity').collapse('show');
      $('#activityTab a[href="#'+data.type+'"]').tab('show');
      var targetForm = $('#collapseAddActivity #' + data.type);
      targetForm.find('.addActivityForm input[name=activity_id]').val(data.id);
      targetForm.find('input[name=title]').val(data.title);
      targetForm.find('textarea[name=description]').val(data.description);
      CKEDITOR.instances[targetForm.find('textarea[name=description]').attr('id')].setData(data.description);
      data = JSON.parse(data.data);
      for(var key in data){
        targetForm.find('[name='+key+']').val(data[key]);
        if(key == 'text_image'){
          initImageInput($('#text_image_placeholder'), targetForm.find('.addActivityForm textarea[name=text_image]'), data[key] ? data[key] : 'https://placehold.it/300x200');
        }
      }
      $('html, body').animate({ scrollTop: $('#addActivityBox').offset().top }, 500);
    });
  });

  // remove activity
  $(document).on('click', '.activity span.glyphicon-remove', function(e){
    var $this = $(this).parents('div.activity');
    var r = confirm('Are you sure to delete this activity?');
    if(r){
      var id = $(this).parents('div.control').data('id');
      $.post(serv_addr+'/activity/delete/'+id+'/', function(data)
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

function initCoverImage(url){
  $.getScript('https://cdn.jsdelivr.net/bootstrap.fileinput/4.3.2/js/fileinput.min.js', function(){
    var instance = $('.uploadImage').fileinput({
      overwriteInitial: true,
      showClose: false,
      showCaption: false,
      showBrowse: false,
      browseOnZoneClick: true,
      removeLabel: 'Remove cover image',
      removeClass: 'btn btn-default btn-block btn-xs',
      defaultPreviewContent: `<img src="${url}" alt="Your Avatar" class="img-responsive">
      <h6 class="text-muted text-center">Click to select cover image</h6>`,
      layoutTemplates: {main2: '{preview} {remove}'},
      allowedFileExtensions: ['jpg', 'png', 'gif']
    });
    (function(){
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader){
        cover_img = reader.result;
      });
      instance.off('filecleared').on('filecleared', function(e){
        instance.fileinput('destroy');
        initCoverImage('https://placehold.it/300x200');
        cover_img = undefined;
      });
    })(instance);
  });
}

function initImageInput(inputEle, targetEle, url){
  $.getScript('https://cdn.jsdelivr.net/bootstrap.fileinput/4.3.2/js/fileinput.min.js', function(){
    inputEle.fileinput('destroy');
    var instance = inputEle.fileinput({
      overwriteInitial: true,
      showClose: false,
      showCaption: false,
      showBrowse: false,
      browseOnZoneClick: true,
      removeLabel: 'Remove cover image',
      removeClass: 'btn btn-default btn-block btn-xs',
      defaultPreviewContent: `<div align="center"><img src="${url}" alt="Your Avatar" width="300" class="img-responsive">
      <h6 class="text-muted text-center">Click to select cover image</h6></div>`,
      layoutTemplates: {main2: '{preview} {remove}'},
      allowedFileExtensions: ['jpg', 'png', 'gif']
    });
    (function(){
      instance.off('fileloaded').on('fileloaded', function(e, file, previewId, index, reader){
        targetEle.val(reader.result);
      });
      instance.off('filecleared').on('filecleared', function(e){
        initImageInput(inputEle, targetEle, 'https://placehold.it/300x200');
        targetEle.val('');
      });
    })(instance);
  });
}

function initCkeditor(){
  $.getScript('https://cdn.ckeditor.com/4.5.9/standard/ckeditor.js', function(){
    $('#collapseAddActivity [name=description]').each(function(){
      var editor = CKEDITOR.replace($(this).attr('id'), {
        language: 'en'
      });
      (function(){
        editor.on('change', function(e){
          $('#' + e.editor.name).val(e.editor.getData());
        });
      })(editor);
    });
  });
}

function renderActivity(index, pk, dataObject){
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
      if(dataObject['video_link']){
        if(dataObject['video_link'].match(/watch\?v=(.*)/) != null){
          dataObject['video_link'] = 'https://www.youtube.com/embed/' + dataObject['video_link'].match(/watch\?v=(.*)/)[1];
        }else if(dataObject['video_link'].match(/vimeo\.com\/(.*)/) != null){
          dataObject['video_link'] = 'https://player.vimeo.com/video/' + dataObject['video_link'].match(/vimeo\.com\/(.*)/)[1];
        }
      }
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
        <h4>${index < 10 ? '0' + index : index}</h4>
        <div class="row">
          <div class="col-md-6">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${dataObject['video_link']}" allowfullscreen></iframe>
            </div>
          </div>
          <div class="col-md-12" style="float:none;">
            <p class="lead">${dataObject['title']}</p>
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityControl}
      </div>`;
      break;
    case 'text':
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
        <h4>${index < 10 ? '0' + index : index}</h4>
        <div class="row">
          ${dataObject['text_image'] ? `<div class="col-md-6"><img src="${dataObject['text_image']}" class="img-responsive"></div>` : ''}
          <div class="col-md-12" ${dataObject['text_image'] ? 'style="float:none;"' : ''}>
            <p class="lead">${dataObject['title']}</p>
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityControl}
      </div>`;
      break;
    case 'code':
      // handle different links
      if(dataObject['code_link']){
        if(dataObject['code_link'].match(/jsfiddle\.net/) != null){
          dataObject['code_link'] = dataObject['code_link'] + 'embedded/';
        }else if(dataObject['code_link'].match(/plnkr\.co/) != null){
          dataObject['code_link'] = 'https://embed.plnkr.co/' + dataObject['code_link'].replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
        }
      }
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
        <h4>${index < 10 ? '0' + index : index}</h4>
        <div class="row">
          <div class="col-md-12">
            <p class="lead">${dataObject['title']}</p>
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${dataObject['code_link']}" allowfullscreen></iframe>
            </div>
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityControl}
      </div>`;
      break;
    case 'file':
      // handle different links
      if(dataObject['file_link']){
        if(dataObject['file_link'].match(/drive\.google\.com/) != null){
          dataObject['file_link'] = 'https://drive.google.com/embeddedfolderview?id=' + dataObject['file_link'].match(/id=(.*)/)[1] + '#list';
        }
      }
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
        <h4>${index < 10 ? '0' + index : index}</h4>
        <div class="row">
          <div class="col-md-12">
            <p class="lead">${dataObject['title']}</p>
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${dataObject['file_link']}" allowfullscreen></iframe>
            </div>
            <div>${dataObject['description']}</div>
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
