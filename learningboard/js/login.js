define(['util', 'mdls/User', 'facebook'], function(util, User, fb) {
  "use strict";

  $(function()
  {
    // redirect if logged in
    if (User.hasToken()) {
      location.href = 'index.html';
      return;
    }

    // switch to register mode
    $('.login_text a').on('click', function(e)
    {
      e.preventDefault();
      $('button.loginBtn, .login_text')
      .addClass('hidden')
      .attr('type', 'button');

      $('button.registerBtn, .register_text')
      .removeClass('hidden')
      .attr('type', 'submit');

      $('.page-header h1').text('Register');
    });

    // switch to login mode
    $('.register_text a').on('click', function(e)
    {
      e.preventDefault();
      $('button.loginBtn, .login_text')
      .removeClass('hidden')
      .attr('type', 'submit');

      $('button.registerBtn, .register_text')
      .addClass('hidden')
      .attr('type', 'button');

      $('.page-header h1').text('Login');
    });

    // login submit
    $("button.loginBtn").on("click", function(e)
    {
      // trigger html5 validation
      if($('form.loginForm')[0].checkValidity()) e.preventDefault();
      else return;
      var inputGroups = $('.username-group, .password-group');
      inputGroups.removeClass('has-warning');
      inputGroups.find('.help-block').text('');
      var o = $("form.loginForm").serializeObject();
      var $btn = $(this).button('loading');
      util.post('/auth/local/', o,
        function(res, status, xhr)
        {
          var data = res.data;
          User.setToken(data.token)
          User.setUser(data.user);
          location.href = 'index.html';
        },
        function(xhr, status)
        {
          $btn.button('reset');
          if (xhr.status === 403) {
            inputGroups.addClass('has-warning');
            inputGroups.find('.help-block').text('Username or password not correct');
          }
          else alert("internal error");
        }
      );
    });

    // register submit
    $('button.registerBtn').on('click', function(e) {
      // trigger html5 validation
      if($('form.loginForm')[0].checkValidity()) e.preventDefault();
      else return;
      var registered = false;
      if (!registered)
      {
        var usernameGroups = $('.username-group');
        usernameGroups.removeClass('has-warning');
        usernameGroups.find('.help-block').text('');
        var o = $('form.loginForm').serializeObject();
        o.username = o.identifier;
        delete o.identifier;
        console.log(o);
        var $btn = $(this).button('loading');
        util.post('/register/', o,
          function(res)
          {
            var data = res.data;
            $("button.loginBtn").trigger('click');
            registered = false;
          },
          function(xhr, status, data)
          {
            $btn.button('reset');
            if (xhr.status === 400) {
              usernameGroups.addClass('has-warning');
              usernameGroups.find('.help-block').text('Username already exists');
            }
            else alert("internal error");
          }
        );
      }
    });

    var login_callback = function(fb) {
      return function(res, status, xhr)
      {
        console.log(res);
        console.log(fb);
        var data = res.data;
        console.log("success");
        User.setToken(data.token);
        User.setUser(data.user);
        User.set("info", {facebook: fb});
        console.log(xhr);
        console.log(User.getInfo());
        util.put("/user/"+User.getId(), User.getInfo(), function(res) {
          location.href = "index.html";
        });
      }
    };

    var login_backend = function(res) {
      var accessToken = res.authResponse.accessToken;
      FB.api('/me', {fields: ["first_name", "middle_name", "last_name", "name", "email", "education", "location", "work"]}, function(res) {
        if (res.error) return;
        console.log(res);
        var obj = {};
        obj.identifier = res.id;
        obj.username = res.id;
        obj.accessToken = accessToken;
        obj.email = res.email;
        console.log('Successful login for: ' + res.name);
        util.post("/auth/facebook/callbackAccessToken", obj, login_callback(res));
      });
    }

    $("button.fbLoginBtn").on("click", function(e) 
    {
      e.preventDefault();
      FB.getLoginStatus(function(res) 
      { 
        if (res.status === "connected") login_backend(res);
        else FB.login(function(res) {if (res.status === "connected") login_backend(res);}, {scope: ["user_education_history", "user_location", "user_work_history"]});
      });
    });
  });
});
