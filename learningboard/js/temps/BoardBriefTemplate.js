// dependencies: Template.js, Board.js
define(['util', 'mdls/User', 'mdls/Board', './Template'], function (util, user, Board, Template)
{
  var BoardBriefTemplate = function(board)
  {
    this.model = new Board(board);
    var serv_addr = util.serv_addr;
    var html = '\
    <div class="col-xs-12 col-sm-4 board-brief-temp '+this.model.getLevelName()+'" data-id="'+this.model.id+'" >\
      <div class="thumbnail">\
        <div class="img-button thumbnail">\
          <!-- <img src="'+serv_addr+this.model.image_url+'" alt="Cover Image"/> -->\
          <img src="https:placehold.it/300x200" alt="Cover Image"/> '
    if (user.is_staff()) {
      html += '\
          <ul class="boardControlBtn">\
            <li class="boardEditButton">\
              <a href="board_edit.html?'+this.model.id+'">Edit</a>\
            </li>\
            <li class="boardSendNewsButton">\
              <a href="#" data-toggle="modal" data-target="#sendNewsModal">Send News</a>\
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
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 myfooter">\
              <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
              <p>'+ this.model.endorsed_num + ' endorsed</p>\
            </div>\
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 myfooter">\
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
              <p>'+ this.model.completed_num + ' completed</p>\
            </div>\
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 myfooter">\
              <span class="fa fa-users" aria-hidden="true"></span>\
              <p class="following_num">'+ this.model.following_num + ' subscribing</p>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>\
    ';
    Template.call(this, $(html));
    var $tmp = this.$template
  }

  $.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);
  return BoardBriefTemplate;
});
