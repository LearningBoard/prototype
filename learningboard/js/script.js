
var serv_addr = "http://127.0.0.1:8000/"

$(document).ready(function()
{
  $.get(serv_addr+'accts/add/', function(data) 
  {
    console.log(data);
    alert(data);
  });

});
