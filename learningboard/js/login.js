
$(document).ready(function()
{
  // redirect if logged in
  if(localStorage['user_id']){
    location.href = 'index.html';
  }
  console.log($("button.loginBtn"));

  // switch to register mode
  $('.login_text a').on('click', function(){
    $('button.loginBtn, .login_text').addClass('hidden');
    $('button.registerBtn, .register_text').removeClass('hidden');
    $('.page-header h1').text('Register');
  });

  // switch to login mode
  $('.register_text a').on('click', function(){
    $('button.loginBtn, .login_text').removeClass('hidden');
    $('button.registerBtn, .register_text').addClass('hidden');
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
    console.log(o);
    $.get(serv_addr+'/accts/login/', o, function(data)
    {
      if(data.ok || data.pk){
        localStorage['user_id'] = data.pk;
        localStorage['is_staff'] = data.is_staff? data.is_staff: false;
        console.log(data.pk);
        location.href = 'index.html';
      }else{
        alert('Username or password not correct')
      }
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
    $.post(serv_addr+'/accts/register/', o, function(data)
    {
      if (data.ok)
      {
        localStorage['user_id'] = data.pk;
        localStorage['is_staff'] = data.is_staff? data.is_staff: false;
        console.log(data.pk);
        location.href = "index.html";
      }
      else
      {
        alert("user already exists");
      }
    });
  });

});
