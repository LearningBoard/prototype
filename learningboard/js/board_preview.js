define(['config', 'util', 'temps/BoardDetailTemplate'], function(config, util, BoardDetailTemplate) {
  "use strict";

  var activity_index = 0;

  $(function(){
    util.setPageTitle(`Preview ${config.componentName.singular}`);

    // fetch and render board data
    if(/\?\d+/.test(location.search))
    {
      var pk = location.search.replace('?', '');
      util.get('/lb/'+pk+'/', 
        function(res) {
          var data = res.data;
          if (data.lb.publish) {
            location.href = `board_view.html?${data.lb.id}`;
            return false;
          }
          var brd_t = new BoardDetailTemplate(data.lb, util.constant.PREVIEW_MODE);
          var brd_m = brd_t.model;
          brd_t.display($(".body_container"));
          util.setPageTitle(brd_m.title + ' (Preview)');
          // unpublish board, deny access
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
