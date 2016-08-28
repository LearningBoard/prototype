// decorator for Commentable Templates
define(['util', 'mdls/User', 'temps/Template', 'temps/CommentTemplate'], function (util, User, Template, CommentTemplate) {
  var CommentableTemplate = function(model)
  {
    var cmt_field = `
      <div class="comment">
        <span class="glyphicon glyphicon-heart ${model.liked ? 'text-danger' : ''}"></span> <span class="liked_num">${model.like_num}</span>
        <span class="glyphicon glyphicon-comment"></span> <span class="comment_num">${model.comments? model.comments.length: 0}</span> comment`;
    if (User.hasToken()) {
      cmt_field += `
        <a class="cmt-toggle" href="#">Add comment</a>`;
    }
    cmt_field += `
        <div class="commentBox hidden">
          <form>
            <div class="input-group">
              <input type="text" name="comment" class="form-control input-sm" required>
              <span class="input-group-btn">
                <button type="submit" class="btn btn-default btn-sm cmt-submit">Submit</button>
              </span>
            </div>
          </form>
        </div>
        <div class="commentList">
          <ul></ul>
        </div>
      </div>
    `;
    this.model = model;
    var $this = this;
    this.$cmtBox = $(cmt_field);

    if (model.comments) {
      model.comments.map(function(item) {
        var temp = new CommentTemplate(item);
        temp.display($this.$cmtBox.find('.commentList ul'));
      });
    }

    // like activity button
    this.$cmtBox.on('click', '.glyphicon-heart', function(){
      if (!User.hasToken()) {
        alert('This feature requires login');
        return;
      }
      var $thisBtn = $(this);
      util.post('/activity/like/'+model.id, {like: !model.liked},
        function(res) {
          $thisBtn.toggleClass('text-danger');
          model.liked = !model.liked;
          if (model.liked) {
            $this.$cmtBox.find('.liked_num').text(++model.like_num);
          } else {
            $this.$cmtBox.find('.liked_num').text(--model.like_num);
          }
        }
      );
    });

    // add comment button
    this.$cmtBox.on('click', 'a.cmt-toggle', function(e){
      e.preventDefault();
      $this.$cmtBox.find('.commentBox').toggleClass('hidden');
    });

    // comment submit button
    this.$cmtBox.on('click', '.commentBox button.cmt-submit', function(e){
      // trigger html5 validation
      if ($this.$cmtBox.find('form')[0].checkValidity()) {
        e.preventDefault();
      } else {
        return;
      }
      var target = $this.$cmtBox.find('[name=comment]');
      util.post('/comment', {comment: target.val(), author: User.getId(), activity: model.id},
        function(res) {
          target.val('');
          var commentNum = parseInt($this.$cmtBox.find('.comment_num').text()) + 1;
          $this.$cmtBox.find('.comment_num').text(commentNum);
          var temp = new CommentTemplate(res.data.comment);
          temp.display($this.$cmtBox.find('.commentList ul'));
        }
      );
    });

    Template.call(this, this.$cmtBox);
  }

  $.extend(CommentableTemplate.prototype, Template.prototype);
  return CommentableTemplate;
});
