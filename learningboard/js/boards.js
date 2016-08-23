define(['util', 'mdls/User', 'temps/BoardBriefListTemplate', 'temps/BoardBriefTemplate'], function(util, user, BoardBriefListTemplate, BoardBriefTemplate) {
  'use strict';
  $(function(){

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

    util.get("/lb?user", 
      function(res)
      {
        var board_list = res.data.lb;
        if (board_list.length) {
          board_list = board_list.map(function(item, i) {
            return new BoardBriefTemplate(item, i);
          });
          board_list = new BoardBriefListTemplate(board_list);
          board_list.display($('#boardList'));
        } else {
          board_list = new BoardBriefListTemplate();
          board_list.display($('#boardList'));
        }
      }
    );
  });
});
