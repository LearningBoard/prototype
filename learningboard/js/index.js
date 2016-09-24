define(['util', 'config', 'User', 'temps/BoardBriefListTemplate', 'temps/BoardBriefTemplate', 'test/dataSet'], function(util, config, User, BoardBriefListTemplate, BoardBriefTemplate, test) {

  $(function()
  {
    util.setPageTitle();

    // render page variable
    $('span.componentName').text(config.componentName.plural);

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
