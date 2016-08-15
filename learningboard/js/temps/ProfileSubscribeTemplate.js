define(['temps/Template'], function (Template) {

  var ProfileSubscribeTemplate = function(data) {

    var $html;

    if (!data.id) {
      $html = $(`
        <div class="col-sm-12 thumbnail sidebar-item">
          <i>No board subscribing</i>
        </div>
      `);
    } else {
      $html = $(`
        <div class="col-sm-4 thumbnail sidebar-item">
          <span>
            <a href="board.view.html?${data.id}" class="no-color-change">
              <i>${data.title}</i>
            </a>
          </span>
        </div>
     `);
    }

    Template.call(this, $html);
  };

  $.extend(ProfileSubscribeTemplate.prototype, Template.prototype);
  return ProfileSubscribeTemplate;
});
