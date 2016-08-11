define(['util', 'mdls/User', 'temps/BoardBriefTemplate'], function(util, user, BoardBriefTemplate) {
  $(function() {
    if (!/\?\d+/.test(location.search)) {
      alert('User not found');
      location.href = 'index.html';
      return;
    }

    var off = $(".fixed-sidebar-right").offset().top;
    $(".fixed-wrap-inner").css("max-width", $(".fixed-sidebar-right").width());
    $(window).resize(function() {
      off = $(".fixed-sidebar-right").offset().top;
      $(".fixed-wrap-inner").css("max-width", $(".fixed-sidebar-right").width());
    });
    $(window).scroll(function() {
      var scroPos = $(window).scrollTop();
      if (scroPos >= off-78) $(".fixed-sidebar-right").addClass("fixed");
      else $(".fixed-sidebar-right").removeClass("fixed");
    });

    var userId = location.search.match(/\?(\d+)/)[1];
    var queryBoardUrl = user.getId() == userId ? '/lb?user' : '/lb?user=' + userId;
    util.get(queryBoardUrl,
      function(res)
      {
        var data = res.data;
        console.log(res);
        var board_list = data.learningboard;
        var $board_list_ele = $("#boardList")
        var length = data.learningboard.length;
        for (var i = 0; i < length; ++i)
        {
          var board = new BoardBriefTemplate(board_list[i]);
          board.display($("#boardList"));
        }
      }
    );
  });
});
