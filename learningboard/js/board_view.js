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


  });
});

