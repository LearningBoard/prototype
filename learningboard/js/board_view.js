define(['util', 'mdls/User', 'temps/BoardDetailTemplate'], function(util, User, BoardDetailTemplate) {
  "use strict";

  var activity_index = 0;

  $(function(){

    var scope = {
      brd_t: null
    }
    // fetch and render board data
    if(/\?\d+/.test(location.search))
    {
      var pk = location.search.replace('?', '');
      util.get('/lb/'+pk+'/', 
        function(res) {
          var data = res.data;

          if (res.success === false) {
            alert('This Learning Board only allow registered user to view.');
            location.href = 'login.html';
            return;
          }

          if (!data.lb.publish) {
            location.href = `board_preview.html?${data.lb.id}`;
            return false;
          }
          scope.brd_t = new BoardDetailTemplate(data.lb);
          var brd_m = scope.brd_t.model;
          scope.brd_t.display($(".body_container"));
          document.title = brd_m.title + ' | Learning Boards';
          // unpublish board, deny access
          $("meta[property='og:title']").attr("content", "My not awesome website");
        },
        function(xhr)
        {
          if (xhr.status === 404) util.err404();
          if (xhr.status === 403) util.err403();
        }
      );
    } else {
      util.err404();
    }
  });
});
