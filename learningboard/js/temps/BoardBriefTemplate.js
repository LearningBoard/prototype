// dependencies: Template.js, Board.js
define(['mdls/Board', './Template'], function (Board, Template) 
{
  var BoardBriefTemplate = function(board) 
  {
    this.model = new Board(board);
    var serv_addr = require('./js/common').serv_addr;
    var html = '\
    <div class="col-md-4 col-sm-4 col-xs-4'+this.model.getLevelName()+'" data-id="'+this.model.id+'" myclass="boardTemplate_'+this.model.id+'">\
      <div class="thumbnail">\
        <img src="'+serv_addr+this.model.image_url+'" alt="Cover Image">\
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
            <div class="col-md-4 col-sm-4 col-xs-4">\
              <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
              <p>'+ this.model.endorsed_num + ' endorsed</p>\
            </div>\
            <div class="col-md-4 col-sm-4 col-xs-4">\
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
              <p>'+ this.model.completed_num + ' completed</p>\
            </div>\
            <div class="col-md-4 col-sm-4 col-xs-4">\
              <span class="fa fa-users" aria-hidden="true"></span>\
              <p class="following_num">'+ this.model.following_num + ' subscribing</p>\
            </div>\
          </div>\
        </div>\
        ';
        if (localStorage.is_staff) {
        html += '\
        <div class="boardControlBtn boardEditButton hidden">\
          <a href="board_edit.html?'+this.model.id+'">Edit</a>\
        </div>\
        <div class="boardControlBtn boardSendNewsButton hidden">\
          <a href="#" data-toggle="modal" data-target="#sendNewsModal">Send News</a>\
        </div>';
      }
      html += '\
      </div>\
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

  $.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);
  return BoardBriefTemplate;
});

