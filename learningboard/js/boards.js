
$(document).ready(function(){
  if (localStorage['is_staff'] === "true")
  {
    $('.thumbnail').on('mouseenter', function(e) {
      $(this).parent().find('.boardEditButton, .boardSendNewsButton').toggleClass('hidden');
    });
    $('.thumbnail').on('mouseleave', function(e) {
      $(this).parent().find('.boardEditButton, .boardSendNewsButton').toggleClass('hidden');
    });

    $('#sendNewsModal').on('shown.bs.modal', function(){
      var modal = $(this);
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
          dataObject['lb_id'] = 1; // TODO hardcode value
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

  $.get(serv_addr+"/lb/load/", {"user_pk": localStorage.user_id}, function(data)
  {
    console.log(data);
  });
});
