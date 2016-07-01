"use strict"
var activity_index = 0;

$(document).ready(function(){

  // fetch and render board data
  if(/\?\d+/.test(location.search)){
    var pk = location.search.replace('?', '');
    $.get(serv_addr+'/lb/get/'+pk+'/', {user_id: localStorage.user_id}, function(data){
      console.log(data);
      var board = new BoardTemplate(data.board);
      // unpublish board, deny access
      if(!board.published() && !localStorage['is_staff']){
        location.href = 'boards.html';
        return;
      }
      board.addDetailParent($(".body_container"));
      board.update();
      if (data.board.followed)
      {
        $(".followBtn").addClass('btn-primary').text("Unfollow");
      }
      
      if (localStorage['is_staff'] !== "true")
      {
        $(".endorseBtn").addClass("hidden");
      }
      else 
      {
        if (localStorage.user_id == data.board.id)
        {
          $(".endorseBtn").addClass("hidden");
        }
        $(".followBtn").addClass("hidden");
      }
      $('.followBtn').on('click', function(){
        if($(".followBtn").hasClass('btn-primary'))
        {
          $.post(serv_addr+'/activity/unfollow/', {user_id: localStorage.user_id, lb_id: pk}, function(data)
          {
            if (data.ok)
            {
              board.board.following_num = data.count;
              board.board.followed = false;
              board.update();
              $(".followBtn").removeClass('btn-primary').text("Follow");
            }
          });
        }
        else
        {
          $.post(serv_addr+'/activity/follow/', {user_id: localStorage.user_id, lb_id: pk}, function(data)
          {
            if (data.ok)
            {
              console.log(board);
              console.log(data.count);
              board.board.followed = true;
              board.update();
              $(".followBtn").addClass('btn-primary').text("Unfollow");
              board.board.following_num = data.count;
            }
          });
        }
      });
    })
    .fail(function(){
      alert('Learning Board not found');
    });

  }

  // follow button

  // endorse button
  $('.action button:eq(1)').on('click', function(){
    if($(this).hasClass('btn-primary')){
      $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) - 1);
      $(this).removeClass('btn-primary');
    }else{
      $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) + 1);
      $(this).addClass('btn-primary');
    }
  });

  // mark as complete button
  $(document).on('click', '.markAsComplete', function(){
    if($(this).attr('style')){
      $(this).css('color', '');
    }else{
      $(this).css('color', 'green');
    }
  });

  // like activity button
  $(document).on('click', '.activity .comment .glyphicon-heart', function(e){
    if($(this).attr('style')){
      $(this).css('color', '');
    }else{
      $(this).css('color', 'red');
    }
  });

  // add comment button
  $(document).on('click', '.activity .comment a', function(e){
    e.preventDefault();
    $(this).parent().find('.commentBox').toggleClass('hidden');
  });

  // comment submit button
  $(document).on('click', '.activity .comment .commentBox button', function(e){
    e.preventDefault();
    var target = $(this).prev();
    $(this).parents('.comment').find('.commentList ul').append(`<li>${target.val()}</li>`);
    target.val('');
  });
});


