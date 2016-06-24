
$(document).ready(function()
{
  // redirect if logged in
  if(localStorage['user_id']){
    location.href = 'index.html';
  }
  console.log($("button.loginBtn"));

  $('.login_text a').on('click', function(){
    $('button.loginBtn, .login_text').addClass('hidden');
    $('button.registerBtn, .register_text').removeClass('hidden');
    $('.page-header h1').text('Register');
  });

  $('.register_text a').on('click', function(){
    $('button.loginBtn, .login_text').removeClass('hidden');
    $('button.registerBtn, .register_text').addClass('hidden');
    $('.page-header h1').text('Login');
  });

  $("button.loginBtn").on("click", function(e) {
    e.preventDefault();
    var o = $("form.loginForm").serializeObject();
    console.log(o);
    $.get(serv_addr+'accts/login/', o, function(data)
    {
      localStorage['user_id'] = data.pk;
      console.log(data.pk);
      location.href = 'index.html';
    });
  });

  $('button.registerBtn').on('click', function(e) {
    e.preventDefault();
    var o = $('form.loginForm').serializeObject();
    console.log(o);
    $.post(serv_addr+'accts/add/', o, function(data)
    {
      localStorage['user_id'] = data.pk;
      console.log(data.pk);
      location.href = 'index.html';
    });
  });

});
