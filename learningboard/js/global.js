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
              <li><a href="#Whatsnew">
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
    return '<div class="col-md-3">\
          <div class="thumbnail">\
            <img src="'+serv_addr+this.board.image_url+'" alt="Cover Image">\
            <div class="caption">\
              <h4 class="title"><a href="board_view.html">'+this.board.title+'</a></a></h4>\
              <p class="text-muted">Content Level: '+this.getLevelName(this.board.level)+' </p>\
              <p>'+this.board.description+'</p>\
              <p class="text-muted title">\
                Status: <span class="text-success">'+this.getStatusName(this.board.status)+'</span><br /> '+this.board.activity_num+' Learning '+(this.board.activity_num == 1? "Activity": "Activities") +
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
}

BoardTemplate.prototype.getLevelName = function(level_num)
{
    switch (level_num)
    {
        case 0: return "beginner";
        case 1: return "intermediate";
        case 2: return "advanced";
    }
}

BoardTemplate.prototype.getStatusName = function(status_num)
{
  switch (status_num)
  {
    case 0: return "unpublished";
    case 1: return "published";
  }
}

serv_addr = "http://127.0.0.1:8000"
