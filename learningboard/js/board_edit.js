$(document).ready(function(){
  $('#boardTitle').on('keydown', function(e){
    $('#boardTitleCount').text(150 - $(this).val().length);
  });
  $('select[name=category]').on('change', function(e){
    $('#headingTwo a').text(this.value);
  });
  $('input[name=contentLevel]').on('change', function(e){
    var level;
    switch(parseInt(this.value)){
      case 0:
        level = 'Beginner';
        break;
      case 1:
        level = 'Intermediate';
        break;
      case 2:
        level = 'Advanced';
        break;
    }
    $('#headingThree a').text(level);
  });
  $('.tagList ul li span').on('click', function(e){
    var $this = $(this).parent();
    $this.fadeOut('slow', function(){
      $this.remove();
    });
  });
});