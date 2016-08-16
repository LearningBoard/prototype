define(['util', 'mdls/User', 'temps/BoardDetailTemplate'], function(util, User, BoardDetailTemplate) {
  "use strict";

  var activity_index = 0;

  $(function(){

    // fetch and render board data
    if(/\?\d+/.test(location.search))
    {
      var pk = location.search.replace('?', '');
      util.get('/lb/'+pk+'/', 
        function(res) {
          var data = res.data;
          var brd_t = new BoardDetailTemplate(data.lb);
          var brd_m = brd_t.model;
          brd_t.display($(".body_container"));
          document.title = brd_m.title + ' | Learning Boards';
          // unpublish board, deny access
          $("meta[property='og:title']").attr("content", "My not awesome website");
        },
        function(xhr)
        {
          if (xhr.status === 404) util.err404();
        }
      );
    }
  });
});
