 // decorator for Commentable Templates
define(function () {
  var CommentableTemplate = function(template)
  {
    $.extend(this, template);
    $.extend(template.__proto__);

    var cmt_field = `
      <div class="comment">
        <span class="glyphicon glyphicon-heart"></span> 0
        <span class="glyphicon glyphicon-comment"></span> 0 comment
        <a class="cmt-toggle" href="#">Add comment</a>
        <div class="commentBox hidden">
          <form>
            <input type="text" name="comment">
            <button type="button" class="btn btn-default btn-xs cmt-submit">Submit</button>
          </form>
        </div>
        <div class="commentList">
          <ul></ul>
        </div>
    `;
    this.$cmtBox = $(cmt_field);
    this.$template.append(this.$cmtBox);

    // add comment button
    this.$cmtBox.on('click', 'a.cmt-toggle', function(e){
      e.preventDefault();
      $(this).parent().find('.commentBox').toggleClass('hidden');
    });

    // comment submit button
    this.$cmtBox.on('click', '.commentBox button.cmt-submit', function(e){
      e.preventDefault();
      var target = $(this).prev();
      $(this).parents('.comment').find('.commentList ul').append(`<li>${target.val()}</li>`);
      target.val('');
    });
  }

  return CommentableTemplate;
});
