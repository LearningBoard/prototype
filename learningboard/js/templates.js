(function() {
  "use strict";
}());


var Template = function($template) {
  // provides a display function for its children
  this.$template = $template;
};

Template.prototype.display = function($container)
{
  $container.append(this.$template);
};

var Board = function(board) 
{
  this.board = board;
};
// Board Mixin, for different templates of learning boards
// extend this Prototype everytime you create a new view for the object

Board.prototype = {

  getLevelName: function()
  {
      switch (this.board.level)
      {
          case 0: return "beginner";
          case 1: return "intermediate";
          case 2: return "advanced";
      };
  },

  getStatusName: function()
  {
    switch (this.board.status)
    {
      case 0: return "unpublished";
      case 1: return "published";
    };
  },

  published: function()
  {
    return this.board.status === 1;
  }

};

var Activity = function(activity) 
{
  this.activity = activity;
};

Activity.prototype = {
  published: function()
  {
    return this.activity.status === 1;
  }
};

function ActivityTemplate(activity, index)
{
  // index: for the order of display
  // inherits Activity and Template

  Activity.call(this, activity);
  this.index = index;

  var html;
  var activityControl = `
  <div class="control" data-id="${activity.pk}">
    <ul class="text-muted">
      <li><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Re Add</li>
      <li><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share</li>
      <li class="markAsComplete"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Mark as complete</li>
    </ul>
  </div>`;
  var activityComment = `
  <div class="comment">
    <span class="glyphicon glyphicon-heart"></span> 0
    <span class="glyphicon glyphicon-comment"></span> 0 comment
    <a href="#">Add comment</a>
    <div class="commentBox hidden">
      <form>
        <input type="text" name="comment">
        <button type="button" class="btn btn-default btn-xs">Submit</button>
      </form>
    </div>
    <div class="commentList">
      <ul></ul>
    </div>
  </div>`;
  switch(activity['type']){
    case 'video':
      // handle different links
      if(activity['video_link']){
        if(activity['video_link'].match(/watch\?v=(.*)/) != null){
          activity['video_link'] = 'https://www.youtube.com/embed/' + activity['video_link'].match(/watch\?v=(.*)/)[1];
        }else if(activity['video_link'].match(/vimeo\.com\/(.*)/) != null){
          activity['video_link'] = 'https://player.vimeo.com/video/' + activity['video_link'].match(/vimeo\.com\/(.*)/)[1];
        }
      }
      html = `
      <div class="activity ${activity['status'] == 'UP' ? 'unpublish' : ''}">
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${activity['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${activity['video_link']}" allowfullscreen></iframe>
            </div>
          </div>
          <div class="col-md-12">
            <div>${activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'text':
      html = `
      <div class="activity ${this.published() ? 'unpublish' : ''}">
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${activity['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          ${activity['text_image'] ? `<div class="col-md-12"><img src="${activity['text_image']}" class="img-responsive"></div>` : ''}
          <div class="col-md-12">
            <div>${activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'code':
      // handle different links
      if(activity['code_link']){
        if(activity['code_link'].match(/jsfiddle\.net/) != null){
          activity['code_link'] = activity['code_link'] + 'embedded/';
        }else if(activity['code_link'].match(/plnkr\.co/) != null){
          activity['code_link'] = 'https://embed.plnkr.co/' + activity['code_link'].replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
        }
      }
      html = `
      <div class="activity ${this.published()? 'unpublish' : ''}">
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${activity['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${activity['code_link']}" allowfullscreen></iframe>
            </div>
            <div>${activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'file':
      // handle different links
      if(activity['file_link']){
        if(activity['file_link'].match(/drive\.google\.com/) != null){
          activity['file_link'] = 'https://drive.google.com/embeddedfolderview?id=' + activity['file_link'].match(/id=(.*)/)[1] + '#list';
        }
      }
      html = `
      <div class="activity ${this.published()? 'unpublish' : ''}">
        <h2>${index < 10 ? '0' + index : index}</h2>
        <p class="lead">${activity['title']}</p>
        <p class="text-muted">
          Posted date: 09 | May | 2016
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${activity['file_link']}" allowfullscreen></iframe>
            </div>
            <div>${activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    default:
      html = `
      <div class="activity">
        <h4>01</h4>
        <p><i>Error occur when rendering activity</i></p>
      </div>`;
  }
  Template.call(this, $(html));
};

$.extend(ActivityTemplate.prototype, Activity.prototype, Template.prototype);

function BoardDetailTemplate(board)
{
  /* this.variables:
    board: the object stores the board data
    $template a jQuery object which stores the html content of this board
    $display_html a jQuery object which stores the the brief html content of this board
  */

  Board.call(this, board);
  var html = `
    <div class="row">
      <div class="col-md-9">
        <p class="lead title board_title"></p>
        <p class="title">By <a href="#">`+this.board.author+`</a> | Content Level: <span class="board_level">`+this.getLevelName()+`</span></p>
        <div class="action">
          <button type="button" class="btn btn-default text-uppercase followBtn">Follow</button>
          <button type="button" class="btn btn-default text-uppercase endorseBtn">Endorse</button>
          <button type="button" class="btn btn-default text-uppercase">Share</button>
        </div>
        <div class="row progressBox">
          <div class="col-md-2">
            <span class="glyphicon glyphicon-book" aria-hidden="true"></span>`+ this.board.activity_num+' learning '+(this.board.activity_num == 1? "activity": "activities")+`
          </div>
          <div class="col-md-2">
            <span aria-hidden="true" class="fa fa-thumb-tack"></span> <span class="progress_endorsed"></span>`+
              this.board.endorsed_num + ' '+ (this.board.endorsed_num == 1? "has ": "have ")+`
            endorsed
          </div>
          <div class="col-md-2">
            <span aria-hidden="true" class="glyphicon glyphicon-ok"></span>`+
            this.board.completed_num + ' ' + (this.board.completed_num == 1? "has ": "have ") +`
            completed
          </div>
          <div class="col-md-2">
            <span aria-hidden="true" class="fa fa-users"></span> <span class="progress_following"></span>
            <span class="following_num">`+
              this.board.following_num + ' ' + (this.board.following_num == 1? "is ": "are ")+`
              following
            </span>
          </div>
          <div class="col-md-4">
            <span class="glyphicon glyphicon-search" aria-hidden="true"></span> 0%<br />
            0 completed<br />
            <div class="progress">
              <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"></div>
            </div>
          </div>
        </div>
        <div class="activityList viewMode">
        </div>`;
      html += `
      </div>
      <div class="col-md-3">
        <h4>About This Board</h4>
        <div class="board_description">${this.board.description}</div>
        <h4>Tag</h4>
        <div class="tagList">
          <ul>`;
      if(this.board.tags && this.board.tags.length > 0){
        for(var i = 0; i < this.board.tags.length; i++){
          html += `<li>${this.board.tags[i].tag}</li>`;
        }
      }
      html +=
      `</ul>
        </div>
      </div>
    </div>
  `;

  Template.call(this, $(html));

  $template = this.$template;

  if (this.board.followed)
  {
    $template.find(".followBtn").addClass('btn-primary').text("Unfollow");
  }
  
  if (localStorage['is_staff'] !== "true")
  {
    $template.find(".endorseBtn").addClass("hidden");
  }
  else 
  {
    if (localStorage.user_id == data.board.id)
    {
      $template.find(".endorseBtn").addClass("hidden");
    }
    $template.find(".followBtn").addClass("hidden");
  }
  $template.find('.followBtn').on('click', function(){
  if($template.find(".followBtn").hasClass('btn-primary'))
  {
    $.post(serv_addr+'/activity/unfollow/', {user_id: localStorage.user_id, lb_id: board.id}, function(data)
    {
      if (data.ok)
      {
        board.following_num -= 1;
        board.followed = false;
        $template.find(".followBtn").removeClass('btn-primary').text("Follow");
        $template.find(".following_num").text(board.following_num + ' ' + (board.following_num == 1? "is ": "are ") + 'following');
      }
    });
  }
  else
  {
    $.post(serv_addr+'/activity/follow/', {user_id: localStorage.user_id, lb_id: board.id}, function(data)
    {
      if (data.ok)
      {
        board.following_num += 1;
        board.followed = true;
        console.log($template);
        console.log($template.find(".following_num"));
        $template.find(".followBtn").addClass('btn-primary').text("Unfollow");
        $template.find(".following_num").text(board.following_num + ' ' + (board.following_num == 1? "is ": "are ") + 'following');
      }
    });
  }
  });

  console.log(board.activities);

  var count = 0;
  $actList = $template.find(".activityList");
  var activities = this.board.activities;
  length = this.board.activities.length;
  for (var i = 0; i < length; ++i)
  {
    var act = new ActivityTemplate(activities[i], i);
    if (act.published()) act.display($actList);
    count++;
  }
  if (count === 0)
  {
    actList.append(`<p class="text-center noActivity"><i>Currently there are no activity in this board</i></p>`);
  }
};

$.extend(BoardDetailTemplate.prototype, Board.prototype, Template.prototype);

function BoardBriefTemplate(board)
{
  Board.call(this, board);
  var html = '<div class="col-md-3" myclass="boardTemplate_'+this.id+'">\
    <div class="thumbnail">\
      <img src="'+serv_addr+this.board.image_url+'" alt="Cover Image">\
      <div class="caption">\
        <h4 class="title"><a href="board_view.html?'+this.board.id+'">'+this.board.title+'</a></a></h4>\
        <p class="text-muted title">Content Level: '+this.getLevelName()+' </p>\
        <p>'+this.board.description+'</p>\
        <p class="text-muted title">\
          Status: <span class="text-success">'+this.getStatusName()+'</span>\
        </p>\
        <p class="text-muted">\
          '+this.board.activity_num+' learning '+(this.board.activity_num == 1? "activity": "activities") +
        '</p>\
      </div>\
      <div class="boardInfoBox">\
        <div class="row text-center text-muted">\
          <div class="col-md-4">\
            <span class="fa fa-thumb-tack" aria-hidden="true"></span>\
            <p>'+ this.board.endorsed_num + ' '+ (this.board.endorsed_num == 1? "has ": "have ") +'endorsed</p>\
          </div>\
          <div class="col-md-4">\
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>\
            <p>'+ this.board.completed_num + ' ' + (this.board.completed_num == 1? "has ": "have ")+'completed</p>\
          </div>\
          <div class="col-md-4">\
            <span class="fa fa-users" aria-hidden="true"></span>\
            <p class="following_num">'+ this.board.following_num + ' ' + (this.board.following_num == 1? "is ": "are ") + 'following</p>\
          </div>\
        </div>\
      </div>\
    </div>\
  </div>';
  Template.call(this, $(html));
}
$.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);

