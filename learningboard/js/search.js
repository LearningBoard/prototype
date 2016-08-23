define(['util', 'temps/BoardBriefListTemplate', 'temps/BoardBriefTemplate'], function(util, BoardBriefListTemplate, BoardBriefTemplate) {
  'use strict';

  $(function()
  {
    util.post('/search/lb', {keyword: decodeURIComponent($.getUrlVar('s').replace(/\+/g, ' '))},
      function(res)
      {
        var bl = res.data.lb;
        if (bl.length) {
          bl = bl.map(function(item, i) {
            return new BoardBriefTemplate(item, i);
          });
          bl = new BoardBriefListTemplate(bl);
          bl.display($('#boardList'));
        } else {
          bl = new BoardBriefListTemplate();
          bl.display($("#boardList"));
        }
      }
    );
  });
});
