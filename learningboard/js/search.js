define(['util', 'temps/BoardBriefTemplate'], function(util, BoardBriefTemplate) {
  'use strict';

  $(function()
  {
    util.post('/search/lb', {keyword: $.getUrlVar('s')},
      function(res)
      {
        var bl = res.data.learningboard;
        if (bl.length > 0) {
          for (var i = 0; i < bl.length; ++i)
          {
            var bt = new BoardBriefTemplate(bl[i]);
            bt.display($("#boardList"));
          }
        } else {
          var bt = new BoardBriefTemplate({});
          bt.display($("#boardList"));
        }
      }
    );
  });
});
