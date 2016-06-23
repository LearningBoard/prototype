$(document).ready(function(){
  $('.activity .comment a').on('click', function(e){
    e.preventDefault();
    $(this).parent().find('.commentBox').toggleClass('hidden');
  });
  $('.activity .comment .commentBox button').on('click', function(e){
    e.preventDefault();
    var target = $(this).prev();
    $('.commentList ul').append(`<li>${target.val()}</li>`);
    target.val('');
  });
});
