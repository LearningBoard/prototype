serv_addr = "http://127.0.0.1:8000"

$(document).ready(function(){
  // dump the nav bar to body
  if(!location.href.includes('board_edit.html')){
    $('body').prepend(`
      <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="index.html">Learning Boards</a>
          </div>
          <div id="navbar" class="collapse navbar-collapse">
            <form class="navbar-form navbar-left" role="search">
              <div class="form-group">
                <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                <input type="text" class="form-control" placeholder="What do you want to learn today?" required>
              </div>
            </form>
            <ul class="nav navbar-nav navbar-right text-center">
              <li><a href="#browse">
                <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
                <br />Browse
              </a></li>
              <li class="${location.href.includes('boards.html') ? 'active' : ''}"><a href="boards.html">
                <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
                <br />My Boards
              </a></li>
              <li class="${location.href.includes('news.html') ? 'active' : ''}"><a href="news.html">
                <span class="glyphicon glyphicon-bell" aria-hidden="true"></span>
                <br />What's New
              </a></li>
              <li class="login ${location.href.includes('login.html') ? 'active' : ''}"><a href="login.html">
                <span class="glyphicon glyphicon-log-in" aria-hidden="true"></span>
                <br />Login
              </a></li>
              <li class="hidden logout"><a href="#">
                <span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>
                <br />Logout
              </a></li>
            </ul>
          </div>
        </div>
      </nav>`);
  }
  // display login/logout
  if(localStorage['user_id']){
    $('.navbar-nav .login').addClass('hidden');
    $('.navbar-nav .logout').removeClass('hidden');
  }else{
    $('.navbar-nav .login').removeClass('hidden');
    $('.navbar-nav .logout').addClass('hidden');
  }
  // logout
  $('.navbar-nav .logout').on('click', function(e){
    e.preventDefault();
    // clear all localStorage
    Object.keys(localStorage).map(function(key){
      localStorage.removeItem(key);
    });
    location.reload();
  });
});

$.getCSS = function(url){
  $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
};

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function BoardTemplate(board)
{
  this.board = board;
  this.display = function()
  {
    return '<div class="col-md-3" data-id='+this.board.id+'>\
          <div class="thumbnail">\
            <img src="'+serv_addr+this.board.image_url+'" alt="Cover Image">\
            <div class="caption">\
              <h4 class="title"><a href="board_view.html?'+this.board.id+'">'+this.board.title+'</a></a></h4>\
              <p class="text-muted text-capitalize">Content Level: '+this.getLevelName(this.board.level)+' </p>\
              <p>'+this.board.description+'</p>\
              <p class="text-muted title">\
                Status: <span class="text-success text-capitalize">'+this.getStatusName(this.board.status)+'</span><br /> '+this.board.activity_num+' learning '+(this.board.activity_num == 1? "Activity": "Activities") +
              '</p>\
            </div>\
            <div class="boardInfoBox">\
              <div class="row text-center text-muted">\
                <div class="col-xs-4">\
                  <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
                  <p>'+ this.board.endorsed_num + ' '+ (this.board.endorsed_num == 1? "has ": "have ") +'endorsed</p>\
                </div>\
                <div class="col-xs-4">\
                  <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
                  <p>'+ this.board.completed_num + ' ' + (this.board.completed_num == 1? "has ": "have ")+'completed</p>\
                </div>\
                <div class="col-xs-4">\
                  <span class="fa fa-users" aria-hidden="true"></span>\
                  <p>'+ this.board.following_num + ' ' + (this.board.following_num == 1? "is ": "are ") + 'following</p>\
                </div>\
              </div>\
            </div>\
            <div class="boardControlBtn boardEditButton hidden">\
              <a href="board_edit.html?'+this.board.id+'">Edit</a>\
            </div>\
            <div class="boardControlBtn boardSendNewsButton hidden">\
             <a href="#" data-toggle="modal" data-target="#sendNewsModal">Send News</a>\
           </div>\
          </div>\
        </div>';
  }
}

BoardTemplate.prototype.getLevelName = function()
{
    switch (this.board.level)
    {
        case 0: return "beginner";
        case 1: return "intermediate";
        case 2: return "advanced";
    }
}

BoardTemplate.prototype.getStatusName = function()
{
  switch (this.board.status)
  {
    case 0: return "unpublished";
    case 1: return "published";
  }
}
BoardTemplate.prototype.display = function()
{
  return '\
    <div class="col-md-3">\
      <div class="thumbnail">\
        <img src="'+serv_addr+this.board.image_url+'" alt="Cover Image">\
        <div class="caption">\
          <h4 class="title"><a href="board_view.html?'+this.board.id+'">'+this.board.title+'</a></a></h4>\
          <p class="text-muted title">Content Level: '+this.getLevelName()+' </p>\
          <p>'+this.board.description+'</p>\
          <p class="text-muted title">\
            Status: <span class="text-success">'+this.getStatusName()+'</span>\
          </p>\
          <p class="text-muted">\
            '+this.board.activity_num+' learning '+(this.board.activity_num == 1? "activity": "activities") +
          '</p>\
        </div>\
        <div class="boardInfoBox">\
          <div class="row text-center text-muted">\
            <div class="col-md-4">\
              <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
              <p>'+ this.board.endorsed_num + ' '+ (this.board.endorsed_num == 1? "has ": "have ") +'endorsed</p>\
            </div>\
            <div class="col-md-4">\
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
              <p>'+ this.board.completed_num + ' ' + (this.board.completed_num == 1? "has ": "have ")+'completed</p>\
            </div>\
            <div class="col-md-4">\
              <span class="fa fa-users" aria-hidden="true"></span>\
              <p>'+ this.board.following_num + ' ' + (this.board.following_num == 1? "is ": "are ") + 'following</p>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>';
}
BoardTemplate.prototype.detail = function()
{
  return `
    <div class="row">
      <div class="col-md-9">
        <p class="lead title board_title"></p>
        <p class="title">By <a href="#">`+this.board.author+`</a> | Content Level: <span class="board_level">`+this.getLevelName()+`</span></p>
        <div class="action">
          <button type="button" class="btn btn-default text-uppercase followBtn">Follow</button>
          <button type="button" class="btn btn-default text-uppercase endorseBtn">Endorse</button>
          <button type="button" class="btn btn-default text-uppercase">Share</button>
        </div>
        <div class="row progressBox">
          <div class="col-md-2">
            <span class="glyphicon glyphicon-book" aria-hidden="true"></span>`+ this.board.activity_num+' learning '+(this.board.activity_num == 1? "activity": "activities")+`
          </div>
          <div class="col-md-2">
            <span aria-hidden="true" class="fa fa-thumb-tack"></span> <span class="progress_endorsed"></span>`+
              this.board.endorsed_num + ' '+ (this.board.endorsed_num == 1? "has ": "have ")+`
            endorsed
          </div>
          <div class="col-md-2">
            <span aria-hidden="true" class="glyphicon glyphicon-ok"></span>`+
            this.board.completed_num + ' ' + (this.board.completed_num == 1? "has ": "have ") +`
            completed
          </div>
          <div class="col-md-2">
            <span aria-hidden="true" class="fa fa-users"></span> <span class="progress_following"></span>`+
              this.board.following_num + ' ' + (this.board.following_num == 1? "is ": "are ")+`
              following
          </div>
          <div class="col-md-4">
            <span class="glyphicon glyphicon-search" aria-hidden="true"></span> 0%<br />
            0 completed<br />
            <div class="progress">
              <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"></div>
            </div>
          </div>
        </div>
        <div class="activityList viewMode">
          <p class="text-center noActivity"><i>Currently there are no activity in this board</i></p>
        </div>
      </div>
      <div class="col-md-3">
        <h4>About This Board</h4>
        <div class="board_description"></div>
        <h4>Tag</h4>
        <div class="tagList">
          <ul></ul>
        </div>
      </div>
    </div>
  `;
}

BoardTemplate.prototype.published = function()
{
  return this.board.status === 1;
}

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
