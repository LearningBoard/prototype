
$(document).ready(function()
{
  // redirect if logged in
  if(localStorage['user_id']){
    location.href = 'index.html';
  }
  console.log($("button.loginBtn"));

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

});
