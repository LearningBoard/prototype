define(['util', 'temps/BoardBriefTemplate'], function(util, BoardBriefTemplate) {

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
      }
    );
  });
}); 
