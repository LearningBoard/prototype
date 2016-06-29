var activity_index = 0;

$(document).ready(function(){
  if (localStorage['is_staff'] !== "true")
  {
    $("#endorseBtn").addClass("hidden");
  }

  // fetch and render board data
  if(/\?\d+/.test(location.search)){
    var pk = location.search.replace('?', '');
    $.get(serv_addr+'lb/get/'+pk+'/', function(data){
      // unpublish board, deny access
      if(data.board.status == 'UP' && !localStorage['is_staff']){
        location.href = 'boards.html';
      }
      if(data.tag){
        data.tag.map(function(item){
          $('.tagList ul').append(`<li>${item.tag}</li>`);
        });
      }
      $('.board_title').text(data.board.title);
      $('.board_description').text(data.board.description);
      $('.board_level').text(data.board.level);
      if(data.activity && data.activity.length > 0){
        $('.activityList .noActivity').hide();
        for(var i = 0; i < data.activity.length; i++){
          $('.activityList').append(renderActivity(++activity_index, data.activity[i].id, $.extend(data.activity[i], JSON.parse(data.activity[i].data))));
        }
      }
    }).fail(function(){
      alert('Learning Board not found');
      location.href = 'boards.html';
    });
  }

  // follow button
  $('.action button:eq(0)').on('click', function(){
    if($(this).hasClass('btn-primary')){
      //$.post(serv_addr+'activity/unfollow/', {user_id: localStorage['user_id'], lb_id: location.})
      $('.progress_following').text(parseInt($('.progress_following').text()) - 1);
      $(this).removeClass('btn-primary');
    }else{
      $('.progress_following').text(parseInt($('.progress_following').text()) + 1);
      $(this).addClass('btn-primary');
    }
  });

  // endorse button
  $('.action button:eq(1)').on('click', function(){
    if($(this).hasClass('btn-primary')){
      $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) - 1);
      $(this).removeClass('btn-primary');
    }else{
      $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) + 1);
      $(this).addClass('btn-primary');
    }
  });

  // mark as complete button
  $(document).on('click', '.markAsComplete', function(){
    if($(this).attr('style')){
      $(this).css('color', '');
    }else{
      $(this).css('color', 'green');
    }
  });

  // like activity button
  $(document).on('click', '.activity .comment .glyphicon-heart', function(e){
    if($(this).attr('style')){
      $(this).css('color', '');
    }else{
      $(this).css('color', 'red');
    }
  });

  // add comment button
  $(document).on('click', '.activity .comment a', function(e){
    e.preventDefault();
    $(this).parent().find('.commentBox').toggleClass('hidden');
  });

  // comment submit button
  $(document).on('click', '.activity .comment .commentBox button', function(e){
    e.preventDefault();
    var target = $(this).prev();
    $(this).parents('.comment').find('.commentList ul').append(`<li>${target.val()}</li>`);
    target.val('');
  });
});


function renderActivity(index, pk, dataObject){
  var html;
  var activityControl = `
  <div class="control" data-id="${pk}">
    <ul class="text-muted">
      <li><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Re Add</li>
      <li><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share</li>
      <li class="markAsComplete"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Mark as complete</li>
    </ul>
  </div>`;
  var activityComment = `
  <div class="comment">
    <span class="glyphicon glyphicon-heart"></span> 0
    <span class="glyphicon glyphicon-comment"></span> 0 comment
    <a href="#">Add comment</a>
    <div class="commentBox hidden">
      <form>
        <input type="text" name="comment">
        <button type="button" class="btn btn-default btn-xs">Submit</button>
      </form>
    </div>
    <div class="commentList">
      <ul></ul>
    </div>
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
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${dataObject['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${dataObject['video_link']}" allowfullscreen></iframe>
            </div>
          </div>
          <div class="col-md-12">
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'text':
      html = `
      <div class="activity ${dataObject['status'] == 'UP' ? 'unpublish' : ''}">
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${dataObject['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          ${dataObject['text_image'] ? `<div class="col-md-12"><img src="${dataObject['text_image']}" class="img-responsive"></div>` : ''}
          <div class="col-md-12">
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityComment}
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
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${dataObject['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${dataObject['code_link']}" allowfullscreen></iframe>
            </div>
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityComment}
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
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${dataObject['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${dataObject['file_link']}" allowfullscreen></iframe>
            </div>
            <div>${dataObject['description']}</div>
          </div>
        </div>
        ${activityComment}
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
