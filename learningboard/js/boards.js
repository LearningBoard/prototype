define(['util', 'mdls/User', 'temps/BoardBriefTemplate'], function(util, user, BoardBriefTemplate) {
  'use strict'; 
  $(function(){
    // login required
    if (!user.getToken()) {
      alert('Login required!');
      location.href = 'login.html';
      return;
    }
    if (user.is_staff())
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
          modal.find('.modal-footer button:eq(1)').off('click').on('click', 
            function(e){
              // trigger html5 validation
              if(modal.find('form')[0].checkValidity()){
                e.preventDefault();
              }else{
                return;
              }
              dataObject = $(this).parents('form').serializeObject();
              dataObject['author_id'] = localStorage['user_id'];
              dataObject['lb_id'] = id;
              util.post('/news/add/', dataObject, 
                function(data){
                  modal.find('input[name=title]').val('');
                  CKEDITOR.instances['sendNewsText'].setData('');
                  alert('News sent!');
                  modal.modal('hide');
                }
              );
            }
          );
        });
      });
      $('#addBoardBtn').removeClass('hidden');
    }

    util.get("/lb?user", 
      function(res)
      {
        var data = res.data;
        console.log(data);
        var board_list = data.learningboard;
        var $board_list_ele = $("#boardList")
        var length = data.learningboard.length;
        if (length) {
          for (var i = 0; i < length; ++i)
          {
            var board = new BoardBriefTemplate(board_list[i]);
            board.display($("#boardList"));
          }
        } else {
          var board = new BoardBriefTemplate({});
          board.display($("#boardList"));
        }
      }
    );
  });
});
