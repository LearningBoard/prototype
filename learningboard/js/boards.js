$(document).ready(function(){
  if (localStorage['is_staff'] === "true")
  {  
    $('.thumbnail').on('mouseenter', function(e) {
      $(this).parent().find('.boardEditButton').toggleClass('hidden');
    });
    $('.thumbnail').on('mouseleave', function(e) {
      $(this).parent().find('.boardEditButton').toggleClass('hidden');
    });
  }
  else
  {
    $('#addBoardBtn').addClass('hidden');
  }

  $.get(serv_addr+"lb/load/", function(data)
  {
    console.log(data);
  });
});