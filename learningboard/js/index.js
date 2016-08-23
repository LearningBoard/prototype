define(['util', 'User', 'temps/BoardBriefListTemplate', 'temps/BoardBriefTemplate', 'test/dataSet'], function(util, User, BoardBriefListTemplate, BoardBriefTemplate, test) {

  $(function()
  {
    util.get('/lb/',
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
        console.log(User.getInfo());
      }
    );
  });
});
