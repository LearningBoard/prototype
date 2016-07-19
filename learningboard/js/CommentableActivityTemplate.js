function CommentableActivityTemplate(activityTemplate)
{
  $.extend(this, activityTemplate);
  $.extend(activityTemplate.__proto__);
  console.log(this);

  var activityComment = `
    <div class="comment">
      <span class="glyphicon glyphicon-heart"></span> 0
      <span class="glyphicon glyphicon-comment"></span> 0 comment
      <a href="#">Add comment</a>
      <div class="commentBox hidden">
        <form>
          <input type="text" name="comment">
          <button type="button" class="btn btn-default btn-xs">Submit</button>
        </form>
      </div>
      <div class="commentList">
        <ul></ul>
      </div>
  `;
  this.$template.append(activityComment);
}
