// dependencies: Template.js, Board.js
define(['mdls/User', 'mdls/Board', './Template'], function (user, Board, Template)
{
  var BoardBriefTemplate = function(board)
  {
    this.model = new Board(board);
    var html;
    if (this.model.id) {
      html = '\
      <div class="col-xs-12 col-sm-4 board-brief-temp '+this.model.getLevelName()+'" data-id="'+this.model.id+'" >\
        <div class="thumbnail">\
          <div class="img-button thumbnail">\
            <img src="'+this.model.getCoverImage()+'" alt="Cover Image" class="img-responsive" />'
      if (user.is_staff()) {
        html += '\
            <ul class="boardControlBtn">\
              <li class="boardEditButton">\
                <a href="board_edit.html?'+this.model.id+'">Edit</a>\
              </li>\
            </ul>\
        ';
      }
      html += '\
          </div>\
          <div class="caption">\
            <h4 class="title"><a href="board_view.html?'+this.model.id+'">'+this.model.title+'</a></a></h4>\
            <p class="text-muted title">Content Level: '+this.model.getLevelName()+' </p>\
            <p class="description">'+this.model.description+'</p>\
            <p class="text-muted title">\
              Status: <span class="text-success">'+this.model.getStatusName()+'</span>\
            </p>\
            <p class="text-muted">\
              '+this.model.activity_num+ (this.model.activity_num_all ? `(+${this.model.activity_num_all - this.model.activity_num})` : '') +' Learning Activities</p>\
          </div>\
          <div class="boardInfoBox">\
            <div class="row text-center text-muted">\
              <div class="col-xs-4">\
                <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
                <p>'+ this.model.endorsed_num + ' endorsed</p>\
              </div>\
              <div class="col-xs-4">\
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
                <p>'+ this.model.completed_num + ' completed</p>\
              </div>\
              <div class="col-xs-4">\
                <span class="fa fa-users" aria-hidden="true"></span>\
                <p class="subscribing_num">'+ this.model.subscribing_num + ' subscribing</p>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
      ';
    } else {
      html = `
      <div class="col-md-12">
        <p class="lead">Could not find any Learning Boards. Create your own one today.</p>
      </div>
      `;
    }
    Template.call(this, $(html));
  };

  $.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);
  return BoardBriefTemplate;
});
