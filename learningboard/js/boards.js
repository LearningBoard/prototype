$.getScript('js/templates.js')

$(document).ready(function(){
  // login required
  if (!localStorage.user_id) {
    alert('Login required!');
    location.href = 'login.html';
    return;
  }

  if (localStorage['is_staff'] === "true")
  {
    $(document).on('mouseenter', '.thumbnail', function(e) {
      $(this).parent().find('.boardControlBtn').toggleClass('hidden');
    });
    $(document).on('mouseleave', '.thumbnail', function(e) {
      $(this).parent().find('.boardControlBtn').toggleClass('hidden');
    });

    $('#sendNewsModal').on('shown.bs.modal', function(e){
      var modal = $(this);
      var id = $(e.relatedTarget).parents('[data-id]').data('id');
      $.getScript('https://cdn.ckeditor.com/4.5.9/standard/ckeditor.js', function(){
        if(!CKEDITOR.instances['sendNewsText']){
          var editor = CKEDITOR.replace('sendNewsText', {
            language: 'en'
          });
          (function(){
            editor.on('change', function(e){
              $('#sendNewsText').val(e.editor.getData());
            });
          })(editor);
        }
        modal.find('.modal-footer button:eq(1)').off('click').on('click', function(e){
          // trigger html5 validation
          if(modal.find('form')[0].checkValidity()){
            e.preventDefault();
          }else{
            return;
          }
          dataObject = $(this).parents('form').serializeObject();
          dataObject['author_id'] = localStorage['user_id'];
          dataObject['lb_id'] = id;
          $.post(serv_addr+'/news/add/', dataObject, function(data){
            modal.find('input[name=title]').val('');
            CKEDITOR.instances['sendNewsText'].setData('');
            alert('News sent!');
            modal.modal('hide');
          });
        });
      });
    });
  }
  else
  {
    $('#addBoardBtn').addClass('hidden');
  }

  $.get(serv_addr+"/lb/user_load/", {user_pk: localStorage.user_id, is_staff: localStorage.is_staff}, function(data)
  {
    console.log(data.board_list);
    var board_list = data.board_list;
    var $board_list_ele = $("#boardList")
    var length = data.board_list.length;
    for (var i = 0; i < length; ++i)
    {
      board = new BoardBriefTemplate(board_list[i]);
      board.display($("#boardList"));
    }
  });
});
