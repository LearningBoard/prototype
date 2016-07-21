define(function(require) {

  var serv_addr = require("js/common").serv_addr;
  var lib = require("./lib");
  var BoardBriefTemplate = require("temps/BoardBriefTemplate");

  $(function() 
  {
    $.get(serv_addr+'/lb/', function(res)
    {
      var bl = res.data.learningboard;
      for (var i = 0; i < bl.length; ++i)
      {
        var bt = new BoardBriefTemplate(bl[i]);
        bt.display($("#boardList"));
      }
    });
  });

}); 
