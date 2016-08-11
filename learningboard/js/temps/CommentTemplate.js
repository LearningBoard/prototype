define(['temps/Template'], function (Template) {

  var CommentTemplate = function(model) {

    var $html = $(`
      <li>
        <p><b>${model.author.username}</b></p>
        <p>${model.comment}</p>
      </li>
   `);

    Template.call(this, $html);
  };

  $.extend(CommentTemplate.prototype, Template.prototype);
  return CommentTemplate;
});
