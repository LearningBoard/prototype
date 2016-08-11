define(['util', 'mdls/User'], function(util, user) {
  "use strict";

  $(function()
  {
    // redirect if logged in
    if (user.hasToken()) {
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
      var o = $("form.loginForm").serializeObject();
      util.post('/auth/local/', o,
        function(res, status, xhr)
        {
          var data = res.data;
          user.setToken(data.token)
          user.set(data.user);
          location.href = 'index.html';
        },
        function(xhr, status)
        {
          if (xhr.status === 403) alert('Username or password not correct');
          else alert("internal error");
        }
      );
    });

    // register submit
    $('button.registerBtn').on('click', function(e) {
      // trigger html5 validation
      if($('form.loginForm')[0].checkValidity()) e.preventDefault();
      else return;
      var o = $('form.loginForm').serializeObject();
      o.username = o.identifier;
      delete o.identifier;
      console.log(o);
      util.post('/register/', o,
        function(res)
        {
          var data = res.data;
          console.log(res);
          user.setToken(data.token);
          user.set(data.user);
          location.href = "index.html";
        },
        function(xhr, status, data)
        {
          if (xhr.status === 400) alert("user already exists");
          else alert("internal error");
        }
      );
    });

    $("button.fbLoginBtn").on("click", function(e) {
      e.preventDefault();
      window.location.href = util.urls.serv_addr+"/auth/facebook/";
    });
  });
});
