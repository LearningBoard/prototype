// dependencies: Template.js, Board.js
define(['mdls/User', 'mdls/Board', './Template'], function (User, Board, Template)
{
  var BoardBriefTemplate = function(board)
  {
    this.model = new Board(board);
    var html;
    console.log(this.model);
    html = '\
    <div class="col-xs-12 col-sm-4 board-brief-temp '+this.model.getLevelName()+'" data-id="'+this.model.id+'" >\
      <div class="thumbnail ' + (this.model.published() ? '' : 'unpublish') + '">\
        <div style="height: 225px;">\
          <img src="'+this.model.getCoverImage()+'" alt="Cover Image" class="img-responsive" />'
    if (User.getId() === this.model.author.id) {
      html += '\
          <ul class="boardControlBtn hidden">\
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
          <p class="text-muted title">Owner: <a href="profile.html?'+this.model.author.id+'">'+this.model.getOwnerName()+'</a></p>\
          <p class="text-muted title">Content Level: '+this.model.getLevelName()+' </p>\
          <p class="description">'+this.model.description+'</p>\
          <p class="text-muted title">\
            Status: <span class="'+(this.model.published()? "text-success": "text-danger")+'">'+this.model.getStatusName()+'</span>\
          </p>\
          <p class="text-muted">\
            '+this.model.activity_num+ (this.model.activity_num_all ? `(+${this.model.activity_num_all - this.model.activity_num})` : '') +' Learning Activities</p>\
        </div>\
        <div class="boardInfoBox">\
          <div class="row text-center text-muted">\
            <div class="col-xs-6">\
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
              <p>'+ this.model.completed_num + ' completed</p>\
            </div>\
            <div class="col-xs-6">\
              <span class="fa fa-users" aria-hidden="true"></span>\
              <p class="subscribing_num">'+ this.model.subscribing_num + ' subscribing</p>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>\
    ';

    html = $(html);
    html.on('mouseenter mouseleave', function(e) {
      html.find('.boardControlBtn').toggleClass('hidden');
    });

    Template.call(this, html);
  };

  $.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);
  return BoardBriefTemplate;
});
