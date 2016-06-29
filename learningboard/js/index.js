
function getLevelName(level)
{
  return "Beginner"
}

$(document).ready(function() 
{
  $.get(serv_addr+'/lb/load/', function(data)
  {
    console.log(data);

    var bl = data.board_list;
    for (var i = 0; i < bl.length; ++i)
    {
      var bt = new BoardTemplate(bl[i]);
      $("#boardList").append(bt.display());
    }
  });
})