define(['temps/Template'], function (Template) {

  var ProfileSubscribeTemplate = function(data) {

    var $html;

    $html = $(`
      <div class="col-sm-4 thumbnail sidebar-item">
        <span>
          <a href="board_view.html?${data.id}" target="_blank" class="no-color-change">
            <i>${data.title}</i>
          </a>
        </span>
      </div>
   `);

    Template.call(this, $html);
  };

  $.extend(ProfileSubscribeTemplate.prototype, Template.prototype);
  return ProfileSubscribeTemplate;
});
