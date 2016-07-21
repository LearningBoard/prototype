
$(document).ready(function()
{
  // redirect if logged in
  if(localStorage['user_id']){
    location.href = 'index.html';
  }
  console.log($("button.loginBtn"));

  // switch to register mode
  $('.login_text a').on('click', function(){
    $('button.loginBtn, .login_text').addClass('hidden').attr('type', 'button');
    $('button.registerBtn, .register_text').removeClass('hidden').attr('type', 'submit');
    $('.page-header h1').text('Register');
  });

  // switch to login mode
  $('.register_text a').on('click', function(){
    $('button.loginBtn, .login_text').removeClass('hidden').attr('type', 'submit');
    $('button.registerBtn, .register_text').addClass('hidden').attr('type', 'button');
    $('.page-header h1').text('Login');
  });

  // login submit
  $("button.loginBtn").on("click", function(e) {
    // trigger html5 validation
    if($('form.loginForm')[0].checkValidity()){
      e.preventDefault();
    }else{
      return;
    }
    var o = $("form.loginForm").serializeObject();
    console.log("babb");
    $.post(serv_addr+'/auth/local/', o, function(res, status, xhr)
    {
      var data = res.data;
      localStorage.user_id = data.user.id;
      localStorage.is_staff = data.user.is_staff? data.user.is_staff: false;
      console.log(document.cookie);
      // location.href = 'index.html';
    }).error(function(xhr, status, info)
    {
      if (xhr.status === 403) alert('Username or password not correct');
      else alert("internal error");
    });
  });

  // register submit
  $('button.registerBtn').on('click', function(e) {
    // trigger html5 validation
    if($('form.loginForm')[0].checkValidity()){
      e.preventDefault();
    }else{
      return;
    }
    var o = $('form.loginForm').serializeObject();
    console.log(o);
    $.post(serv_addr+'/register/', o, function(res)
    {
      var data = res.data;
      localStorage.user_id = data.user.id;
      localStorage.is_staff = data.user.is_staff? data.user.is_staff: false;
      location.href = "index.html";
    }).error(function(xhr, status, data)
    {
      if (xhr.status === 400) alert("user already exists");
      else alert("internal error");
    });
  });

});
