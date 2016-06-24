$(document).ready(function(){
<<<<<<< HEAD
  $('.activity .control .glyphicon-ok').parent().on('click', function(){
    $(this).css('color', 'green');
  });
=======
  $('.action button:eq(0)').on('click', function(){
    if($(this).hasClass('btn-primary')){
      $('.progress_following').text(parseInt($('.progress_following').text()) - 1);
      $(this).removeClass('btn-primary');
    }else{
      $('.progress_following').text(parseInt($('.progress_following').text()) + 1);
      $(this).addClass('btn-primary');
    }
  });
  $('.action button:eq(1)').on('click', function(){
    if($(this).hasClass('btn-primary')){
      $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) - 1);
      $(this).removeClass('btn-primary');
    }else{
      $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) + 1);
      $(this).addClass('btn-primary');
    }
  });
  $('.activity .control .glyphicon-ok').parent().on('click', function(){
    $(this).css('color', 'green');
  });
  $('.activity .comment .glyphicon-heart').on('click', function(e){
    if($(this).attr('style')){
      $(this).css('color', '');
    }else{
      $(this).css('color', 'red');
    }
  });
>>>>>>> 7edc789199db602934ebd1994b1a0dfaa2d29893
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
