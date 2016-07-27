define(['util', 'temps/BoardBriefTemplate', 'test/dataSet'], function(util, BoardBriefTemplate, test) {

  $(function() 
  {
    util.get('/lb/', 
      function(res)
      {
        var bl = res.data.learningboard;
        for (var i = 0; i < bl.length; ++i)
        {
          var bt = new BoardBriefTemplate(bl[i]);
          bt.display($("#boardList"));
        }
        for (var i = 0; i < 10; ++i)
        {
          var bt = new BoardBriefTemplate(test.lb[0]);
          bt.display($("#boardList"));
        }
      }
    );
  });
}); 
