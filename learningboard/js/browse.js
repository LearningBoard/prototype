$.getScript('js/templates.js');

$(document).ready(function()
{
  $.get(serv_addr+'/lb/load/', function(data)
  {
    var bl = data.board_list;
    for (var i = 0; i < bl.length; ++i)
    {
      var bt = new BoardBriefTemplate(bl[i]);
      bt.display($("#boardList"));
    }
  });
  $.getScript('https://cdn.jsdelivr.net/isotope/3.0.0/isotope.pkgd.min.js', function(){
    $('#boardList').isotope({
      itemSelector: '.col-md-3',
      layoutMode: 'fitRows'
    });
    $('#boardList').on('arrangeComplete', function(){
      if($('#boardList .col-md-3:visible').length < 1){
        alert('No result found');
        $('.filter_showall').trigger('click');
      }
    });
  });
  $('.filter_showall').on('click', function(e){
    e.preventDefault();
    $(this).parent().find('button.btn-primary').removeClass('btn-primary');
    $(this).addClass('btn-primary');
    $('#boardList').isotope({
      filter: '*'
    });
  });
  $('.filter_beginner').on('click', function(e){
    e.preventDefault();
    $(this).parent().find('button.btn-primary').removeClass('btn-primary');
    $(this).addClass('btn-primary');
    $('#boardList').isotope({
      filter: '.col-md-3.beginner'
    });
  });
  $('.filter_advanced').on('click', function(e){
    e.preventDefault();
    $(this).parent().find('button.btn-primary').removeClass('btn-primary');
    $(this).addClass('btn-primary');
    $('#boardList').isotope({
      filter: '.col-md-3.advanced'
    });
  });
  $('.filter_intermediate').on('click', function(e){
    e.preventDefault();
    $(this).parent().find('button.btn-primary').removeClass('btn-primary');
    $(this).addClass('btn-primary');
    $('#boardList').isotope({
      filter: '.col-md-3.intermediate'
    });
  });
});
