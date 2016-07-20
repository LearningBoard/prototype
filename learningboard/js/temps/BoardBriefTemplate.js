// dependencies: Template.js, Board.js
function BoardBriefTemplate(board)
{
  Board.call(this, board);
  var html = '\
  <div class="col-md-4 col-sm-4 col-xs-4'+this.getLevelName()+'" data-id="'+this.board.id+'" myclass="boardTemplate_'+this.board.id+'">\
    <div class="thumbnail">\
      <img src="'+serv_addr+this.board.image_url+'" alt="Cover Image">\
      <div class="caption">\
        <h4 class="title"><a href="board_view.html?'+this.board.id+'">'+this.board.title+'</a></a></h4>\
        <p class="text-muted title">Content Level: '+this.getLevelName()+' </p>\
        <p class="description">'+this.board.description+'</p>\
        <p class="text-muted title">\
          Status: <span class="text-success">'+this.getStatusName()+'</span>\
        </p>\
        <p class="text-muted">\
          '+this.board.activity_num+ (this.board.activity_num_all ? `(+${this.board.activity_num_all - this.board.activity_num})` : '') +' Learning Activities</p>\
      </div>\
      <div class="boardInfoBox">\
        <div class="row text-center text-muted">\
          <div class="col-md-4 col-sm-4 col-xs-4">\
            <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
            <p>'+ this.board.endorsed_num + ' endorsed</p>\
          </div>\
          <div class="col-md-4 col-sm-4 col-xs-4">\
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
            <p>'+ this.board.completed_num + ' completed</p>\
          </div>\
          <div class="col-md-4 col-sm-4 col-xs-4">\
            <span class="fa fa-users" aria-hidden="true"></span>\
            <p class="following_num">'+ this.board.following_num + ' subscribing</p>\
          </div>\
        </div>\
      </div>\
      ';
      if (localStorage.is_staff) {
      html += '<div class="boardControlBtn boardEditButton hidden">\
        <a href="board_edit.html?'+this.board.id+'">Edit</a>\
      </div>\
      <div class="boardControlBtn boardSendNewsButton hidden">\
        <a href="#" data-toggle="modal" data-target="#sendNewsModal">Send News</a>\
      </div>';
    }
    html += '</div>\
  </div>';
  Template.call(this, $(html));

}

BoardBriefTemplate.prototype.getLevelName = function(level) 
{
  return "Beginner";
};

BoardBriefTemplate.prototype.getStatusName = function(level)
{
  return "published";
};

var x = $.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);

