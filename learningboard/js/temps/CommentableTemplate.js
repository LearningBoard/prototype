 // decorator for Commentable Templates
define(['util'], function (util) {
  var CommentableTemplate = function(template)
  {
    $.extend(this, template);
    $.extend(template.__proto__);

    var $this = this;
    var model = this.model;
    var cmt_field = `
      <div class="comment">
        <span class="glyphicon glyphicon-heart ${model.liked ? 'text-danger' : ''}"></span> <span class="liked_num">${model.like_num}</span>
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

    // like activity button
    this.$cmtBox.on('click', '.glyphicon-heart', function(){
      var $thisBtn = $(this);
      util.post('/activity/like/'+model.id, {like: !model.liked},
        function(res) {
          $thisBtn.toggleClass('text-danger');
          model.liked = !model.liked;
          var num = parseInt($this.$cmtBox.find('.liked_num').text());
          if (model.liked) {
            $this.$cmtBox.find('.liked_num').text(++num);
          } else {
            $this.$cmtBox.find('.liked_num').text(--num);
          }
        }
      );
    });

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
