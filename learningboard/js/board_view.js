define(['util', 'temps/BoardDetailTemplate'], function(util, BoardDetailTemplate) {
  "use strict";

  var serv_addr = require('js/common').serv_addr;

  var activity_index = 0;

  $(document).ready(function(){

    // fetch and render board data
    if(/\?\d+/.test(location.search)){
      var pk = location.search.replace('?', '');
      $.get(serv_addr+'/lb/'+pk+'/', {user_id: localStorage.user_id}, function(res){
        var data = res.data;
        var board = new BoardDetailTemplate(data.learningboard);
        board.display($(".body_container"));
        document.title = board.board.title + ' | Learning Boards';
        // unpublish board, deny access
        if(!board.published() && !localStorage.is_staff){
          location.href = 'boards.html';
          return;
        }
      });
      /*
      .fail(function(){
        $(".body_container").append(board.detail());

      if (localStorage['is_staff'] !== "true")
      {
        $(".endorseBtn").addClass("hidden");
      }
      else
      {
        $(".followBtn").addClass("hidden");
      }
      }).fail(function(){
        alert('Learning Board not found');
      });
      */

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

  });
});

