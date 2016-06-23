
$(document).ready(function()
{
  console.log($("button.loginBtn"));

  $("button.loginBtn").on("click", function(e) {
    e.preventDefault();
    var o = $("form.loginForm").serializeObject();
    console.log(o);
    $.get(serv_addr+'accts/login/', o, function(data) 
    {
      console.log(data);
    });
  });

});
