$(document).ready(function(){
  // dump the nav bar to body
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
    localStorage.removeItem('user_id');
    location.reload();
  });
});
