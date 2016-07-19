  
$(document).ready(function() 
{
  $.get(serv_addr+'/lb/load/', function(data)
  {
    console.log(data);

    var bl = data.board_list;
    for (var i = 0; i < bl.length; ++i)
    {
      var bt = new BoardBriefTemplate(bl[i]);
      console.log(bt);
      bt.display($("#boardList"));
    }
  });
})