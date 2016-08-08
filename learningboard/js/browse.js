define(['util', 'temps/BoardBriefTemplate', 'isotope'], function (util, BoardBriefTemplate, Isotope) {
  $(document).ready(function()
  {
    var grid = new Isotope($('#boardList')[0], {
      itemSelector: '.board-brief-temp',
      layoutMode: 'fitRows'
    });
    util.get('/lb/',
      function(res) {
        var data = res.data;
        var bl = data.learningboard;
        for (var i = 0; i < bl.length; ++i)
        {
          var bt = new BoardBriefTemplate(bl[i]);
          bt.display($("#boardList"));
          grid.appended(bt.$template);
        }
      }
    );
    $('#boardList').on('arrangeComplete', function(){
      if($('#boardList .board-brief-temp:visible').length < 1){
        alert('No result found');
        $('.filter[data-filter="all"]').trigger('click');
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
