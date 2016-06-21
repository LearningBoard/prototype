$(document).ready(function(){
  $('.thumbnail').on('mouseenter', function(e) {
    $(this).parent().find('.boardEditButton').toggleClass('hidden');
  });
  $('.thumbnail').on('mouseleave', function(e) {
    $(this).parent().find('.boardEditButton').toggleClass('hidden');
  });
});