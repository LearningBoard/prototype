define(['temps/Template'], function (Template) {

  var CommentTemplate = function(model) {

    this.model = model;
    var $html = $(`
      <li>
        <p><b><a href="profile.html?${model.author.id}" target="_blank">${model.author.username}</a></b></p>
        <p>${model.comment}</p>
      </li>
   `);

    Template.call(this, $html);
  };

  $.extend(CommentTemplate.prototype, Template.prototype);
  return CommentTemplate;
});
