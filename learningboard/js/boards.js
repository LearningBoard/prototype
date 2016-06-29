
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
        var modal = $(this);
        modal.find('.modal-footer button:eq(1)').on('click', function(e){
          e.preventDefault();
          console.log($('#sendNewsText').val());
        });
      });
    });
  }
  else
  {
    $('#addBoardBtn').addClass('hidden');
  }

  $.get(serv_addr+"/lb/load/", {"user_pk": localStorage.user_id} function(data)
  {
    console.log(data);
  });
});
