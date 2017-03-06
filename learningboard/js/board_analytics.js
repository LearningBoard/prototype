define(['config', 'util', 'mdls/User', 'temps/BoardDetailTemplate'], function(config, util, User, BoardDetailTemplate) {
  'use strict';

  $(function() {
    util.setPageTitle(`Analytics ${config.componentName.singular}`);

    // fetch and render board data
    if (/\?\d+/.test(location.search)) {
      var pk = location.search.replace('?', '');
      util.get('/lb/'+pk+'/', function(res) {
        var data = res.data;
        // Only author can view analytics
        if (User.getId() !== data.lb.author.id) {
          util.err403();
          return false;
        }
        var brd_t = new BoardDetailTemplate(data.lb, util.constant.ANALYTICS_MODE);
        var brd_m = brd_t.model;
        brd_t.display($('.body_container'));
        util.setPageTitle(brd_m.title + ' (Analytics)');
      }, function(xhr) {
        // unpublish board, deny access
        if (xhr.status === 404) util.err404();
        if (xhr.status === 403) util.err403();
      });
    } else {
      util.err404();
    }
  });
});
