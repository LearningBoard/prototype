define(['util', 'temps/ListElementTemplate'], function(util, ListElementTemplate) {
  'use strict';

  var NewsTemplate = function(news, index) {

    var coverImage = news.body.lb.coverImage ? (util.urls.media_addr + '/' + news.body.lb.coverImage) : 'img/placeholder-no-image.png';

    var $html = $(`
      <div class="thumbnail">
        <div class="row">
          <div class="col-sm-4">
            <img src="${coverImage}" class="img-responsive" />
          </div>
          <div class="col-sm-8" style="height: 150px">
            <div style="height: 30%">
              <h4 class="ellipsis ellipsis-2-lines">New Activity <i>${news.body.title}</i> in Board <a href="board_view.html?${news.body.lb.id}">${news.body.lb.title}</a></h4>
            </div>
            <div style="height: 60%">
              <p class="ellipsis ellipsis-4-lines">${news.body.description}</p>
            </div>
            <p style="color: #888;  bottom: 0px">${news.user.username}, ${new Date(news.createdAt).toDateString()}</p>
          </div>
        </div>
      </div>
    `);

    ListElementTemplate.call(this, $html, index);
  };

  $.extend(NewsTemplate.prototype, ListElementTemplate.prototype);
  return NewsTemplate;
});
