//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
  baseUrl: 'js/',
  waitSeconds: 30,
  paths: {
    temps: 'temps/',
    mdls: 'models/',
    test: "test/",
    jquery: 'lib/jquery-2.2.4.min',
    jquery_ui: 'https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min',
    bootstrap: 'lib/bootstrap.min',
    util: 'lib/util',
    fileinput: 'https://cdn.jsdelivr.net/bootstrap.fileinput/4.3.2/js/fileinput.min',
    isotope: "https://npmcdn.com/isotope-layout@3.0/dist/isotope.pkgd.min"
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'bootstrap'
    },
    jquery_ui: {
      deps: ['jquery'],
      exports: 'jquery_ui'
    }
  }
});

define(['jquery', 'bootstrap', 'mdls/User'], function(jquery, bootstrap, user) {
  var public_list = ['index.html', 'login.html']
  $(function() {
    // dump the nav bar to body
    if(!location.href.includes('board_edit.html'))
    {
      $('body').prepend(`
        <nav class="navbar navbar-default navbar-fixed-top top-navbar">
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
                  <span class="glyphicon glyphicon-search search-bar-glyphicon" aria-hidden="true"></span>
                  <input type="text" class="form-control search-bar" placeholder="What do you want to learn today?" required>
                </div>
              </form>
              <ul class="nav navbar-nav navbar-right text-center">
                <li class="${location.href.includes('browse.html') ? 'active' : ''}"><a href="browse.html">
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
        </nav>`
      );
    }
    // display login/logout
    if(user.hasToken())
    {
      $('.navbar-nav .login').addClass('hidden');
      $('.navbar-nav .logout').removeClass('hidden');
    }
    else
    {
      var public = false;
      for (var i = 0; i < public_list.length; ++i)
      {
        if (location.href.indexOf(public_list[i]) > -1)
        {
          public = true;
          break;
        }
      }
      if (!public)
      {
        alert("please login first");
        location.href = "login.html";
      }

      $('.navbar-nav .login').removeClass('hidden');
      $('.navbar-nav .logout').addClass('hidden');
    }
    // logout
    $('.navbar-nav .logout')
    .on(
      'click', 
      function(e)
      {
        e.preventDefault();
        user.clear();
      }
    );
  });

  // polyfill
  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  $.getCSS = function(url)
  {
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', url));
  };

  $.fn.serializeObject = function()
  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, 
      function() 
      {
        if (o[this.name] !== undefined) 
        {
          if (!o[this.name].push) 
            o[this.name] = [o[this.name]];

          o[this.name].push(this.value || '');
        } 
        else 
          o[this.name] = this.value || '';
      }
    );
    return o;
  };
});
