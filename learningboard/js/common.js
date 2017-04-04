//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.

// https://developers.google.com/analytics/devguides/collection/analyticsjs/#alternative_async_tracking_snippet
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;

requirejs.config({
  baseUrl: 'js/',
  waitSeconds: 30,
  paths: {
    // Path
    temps: 'temps/',
    mdls: 'models/',
    test: 'test/',

    // Library
    webshim: 'https://cdn.jsdelivr.net/webshim/1.15.10/polyfiller',
    webrtcpolyfill: 'https://cdnjs.cloudflare.com/ajax/libs/adapterjs/0.14.0/adapter.min',
    OneDrive: 'https://js.live.net/v7.0/OneDrive',
    jquery: 'https://cdn.jsdelivr.net/jquery/1.12.4/jquery.min',
    jquery_ui: 'https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min',
    bootstrap: 'https://cdn.jsdelivr.net/bootstrap/3.3.5/js/bootstrap.min',
    fileinput: 'https://cdn.jsdelivr.net/bootstrap.fileinput/4.3.5/js/fileinput.min',
    select2: 'https://cdn.jsdelivr.net/select2/4.0.3/js/select2.min',
    isotope: 'https://npmcdn.com/isotope-layout@3.0/dist/isotope.pkgd.min',
    fbsdk: '//connect.facebook.net/en_US/sdk',
    ga: 'https://www.google-analytics.com/analytics',
    _vjs: 'https://cdnjs.cloudflare.com/ajax/libs/video.js/5.8.8/video.min',
    videojs_offset: 'lib/videojs-offset',
    YouTube: 'https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.3.2/Youtube.min',
    Vimeo: 'lib/Vimeo',
    Timer: "lib/timer",
    moment: 'https://cdn.jsdelivr.net/momentjs/2.17.1/moment.min',
    ckeditor: 'https://cdn.ckeditor.com/4.5.11/standard-all/ckeditor',
    highcharts: 'https://cdn.jsdelivr.net/highcharts/5.0.9/highcharts',
    'bootstrap-dialog': 'https://cdn.jsdelivr.net/bootstrap3-dialog/1.35.3/bootstrap-dialog.min',

    // Application related
    util: 'lib/util',
    User: "models/User",

    // Wrapper
    facebook: 'lib/facebookAPI',
    videojs: 'lib/video',
  },
  shim: {
    webshim: {
      deps: ['jquery'],
      exports: 'webshim',
      init: function() {
        // https://github.com/jquery/jquery/issues/2058
        $.swap = function( elem, options, callback, args ) {
          var ret, name,
          old = {};

          // Remember the old values, and insert the new ones
          for ( name in options ) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
          }

          ret = callback.apply( elem, args || [] );

          // Revert the old values
          for ( name in options ) {
            elem.style[ name ] = old[ name ];
          }

          return ret;
        };
        webshim.polyfill('forms');
      }
    },
    bootstrap: {
      deps: ['jquery']
    },
    jquery_ui: {
      deps: ['jquery']
    },
    facebook: {
      exports: 'FB'
    },
    ga: {
      exports: 'ga'
    },
    Vimeo: {
      deps: ['videojs']
    },
    YouTube: {
      deps: ['videojs']
    },
    videojs_offset: {
      deps: ['videojs']
    },
    ckeditor: {
      exports: 'CKEDITOR'
    },
    highcharts: {
      exports: 'Highcharts'
    },
    'bootstrap-dialog': {
      deps: ['jquery', 'bootstrap'],
      exports: 'BootstrapDialog'
    }
  },
});

define(['config', 'mdls/User', 'webshim', 'jquery', 'bootstrap', 'ga'], function(config, User) {
  ga('create', config.ganalytics.trackingId, 'auto');
  ga('send', 'pageview');

  var public_list = ['index.html', 'login.html', 'browse.html', 'board_view.html', 'profile.html', 'search.html', '403.html', '404.html'];
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
              <a class="navbar-brand" href="index.html">${config.appName}</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
              <form class="navbar-form navbar-left" role="search" action="search.html">
                <div class="form-group">
                  <span class="glyphicon glyphicon-search search-bar-glyphicon" aria-hidden="true"></span>
                  <input type="text" class="form-control search-bar" name="s" placeholder="What do you want to learn today?" required>
                </div>
              </form>
              <ul class="nav navbar-nav navbar-right text-center">
                <li class="top-fixed-btn ${location.href.includes('profile.html?'+User.getId()) ? 'active' : ''}"><a href="profile.html?${User.getId()}"><span class="glyphicon glyphicon-user" area-hidden="true"></span>
                  <br />Profile
                </a></li>
                <li class="top-fixed-btn ${location.href.includes('browse.html') ? 'active' : ''}"><a href="browse.html">
                  <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
                  <br />Browse
                </a></li>
                <li class="top-fixed-btn ${location.href.includes('boards.html') ? 'active' : ''}"><a href="boards.html">
                  <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
                  <br />My ${config.componentName.plural}
                </a></li>
                <li class="top-fixed-btn ${location.href.includes('news.html') ? 'active' : ''}"><a href="news.html">
                  <span class="glyphicon glyphicon-bell" aria-hidden="true"></span>
                  <br />What's New
                </a></li>
                <li class="login top-fixed-btn ${location.href.includes('login.html') ? 'active' : ''}"><a href="login.html">
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

    // dump footer
    $('footer').html(`
      <div class="container">
        <p class="text-muted">${config.appName}</p>
      </div>`
    );

    // display login/logout
    if(User.hasToken())
    {
      $('.navbar-nav .login').addClass('hidden');
      $('.navbar-nav .logout').removeClass('hidden');
    }
    else
    {
      var public = false;
      for (var i = 0; i < public_list.length; ++i)
      {
        if (location.href.endsWith('/')) {
          public = true;
          break;
        }
        else if (!location.href.endsWith('/') && location.href.indexOf(public_list[i]) > -1)
        {
          public = true;
          break;
        }
      }
      if (!public)
      {
        alert("This feature requires login");
        location.href = "login.html";
        return;
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
        User.clear();
        location.href = 'index.html';
      }
    );

    // Set user id for tracking
    ga(function(track) {
      if (!User.getId())
        User.set("id", track.get("clientId"));
    });
  });

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

  // https://gist.github.com/varemenos/2531765
  $.getUrlVar = function(key) {
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
  };

  // https://github.com/angular/angular.js/blob/0400dc9c2a548a5015d5b73124a1b79f0a68566f/src/ng/filter/filters.js#L230
  $.padNumber = function (num, digits, trim) {
    var neg = '';
    if (num < 0) {
      neg =  '-';
      num = -num;
    }
    num = '' + num;
    while (num.length < digits) num = '0' + num;
    if (trim) {
      num = num.substr(num.length - digits);
    }
    return neg + num;
  };

});
