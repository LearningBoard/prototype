define(['util', 'temps/BoardBriefListTemplate', 'temps/BoardBriefTemplate', 'isotope'], function (util, BoardBriefListTemplate, BoardBriefTemplate, Isotope) {
  $(document).ready(function()
  {
    var grid = new Isotope($('#boardList')[0], {
      itemSelector: '.board-brief-temp',
      layoutMode: 'fitRows'
    });
    util.get('/lb/',
      function(res) {
        var bl = res.data.lb;
        if (bl.length) {
          bl = bl.map(function(item, i) {
            var bt = new BoardBriefTemplate(item, i);
            grid.appended(bt.$template);
            return bt;
          });
          bl = new BoardBriefListTemplate(bl);
          bl.display($('#boardList'));
        } else {
          bl = new BoardBriefListTemplate();
          bl.display($("#boardList"));
        }
        // trigger init arrange to fix all elements stacked together
        grid.arrange({
          filter: '',
          transitionDuration: 0
        });
      }
    );
    $('#boardList').on('arrangeComplete', function(e, filteredItems){
      var isAll = Isotope.data($('#boardList')[0]).options.filter === '';
      if(filteredItems.length < 1 && !isAll){
        console.log("no results");
      }
    });
    $('.filter').on('click', function(e){
      e.preventDefault();
      $(this).siblings('button.btn-primary').removeClass('btn-primary');
      $(this).addClass('btn-primary');
      var selector;
      switch($(this).data('filter')) {
        case 0: selector = '.board-brief-temp.beginner'; break;
        case 1: selector = '.board-brief-temp.intermediate'; break;
        case 2: selector = '.board-brief-temp.advanced'; break;
        default: selector = '';
      }
      grid.arrange({
        filter: selector
      });
    });
  });
});
