define(['util', 'User', 'temps/BoardBriefTemplate', 'test/dataSet'], function(util, User, BoardBriefTemplate, test) {

  $(function()
  {
    util.get('/lb/',
      function(res)
      {
        var bl = res.data.lb;
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
        console.log(User.getInfo());
      }
    );
    console.log()
  });
});
