(function() {
  "use strict";
}());
$.getScript("https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.js");

var ListTemplate = function(templateList, $frame, $inner_container)
{
  this._templateList = templateList;
  // a list of Template objects

  this.$_container = $inner_container;
  // a jQuery html element which contains all children templates

  this.$frame = $frame;
}

ListTemplate.prototype.display = function()
{
  var outer_containers = arguments;
  this.$_container.empty();
  for (var i = 0; i < this._templateList.length; ++i)
  {
    this._templateList[i].display(this.$_container);
  }
  for (var i = 0; i < arguments.length; ++i)
  {
    outer_containers[i].append(this.$frame);
  }
}

var Template = function($template) {
  // provides a display function for its children
  this.$template = $template;
};

Template.prototype.display = function()
{
  for (var i = 0; i < arguments.length; ++i)
    arguments[i].append(this.$template);
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
  this.index = ++index;
  this.render();
};

ActivityTemplate.prototype.render = function(activity)
{
  if(activity){
    this.activity = activity;
  }
  var html;
  var activityControl;

  if(localStorage.is_staff && location.href.includes('board_edit.html')){
    activityControl = `
    <div class="control" data-id="${this.activity.id}">
      <ul>
        <li ${this.activity['status'] == 0 ? 'class="hidden"' : ''}><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span></li>
        <li ${this.activity['status'] == 0 ? '' : 'class="hidden"'}><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span></li>
        <li><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></li>
        <li><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></li>
      </ul>
    </div>`;
  }else{
    activityControl = `
    <div class="control" data-id="${this.activity.id}">
      <ul class="text-muted">
        <li><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Re Add</li>
        <li><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share</li>
        <li class="markAsComplete"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Mark as complete</li>
      </ul>
    </div>`;
  }
  var activityComment = '';
  if (!location.href.includes('board_edit.html')) {
    activityComment = `
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
  }
  try
  {
    $.extend(this.activity, JSON.parse(this.activity.data));
  }
  catch (err)
  {
    console.log(err);
    console.log(this);
  }
  switch(this.activity['type']){
    case 'video':
      // handle different links
      if(this.activity['video_link']){
        if(this.activity['video_link'].match(/watch\?v=(.*)/) != null){
          this.activity['video_link'] = 'https://www.youtube.com/embed/' + this.activity['video_link'].match(/watch\?v=(.*)/)[1];
        }else if(this.activity['video_link'].match(/vimeo\.com\/(.*)/) != null){
          this.activity['video_link'] = 'https://player.vimeo.com/video/' + this.activity['video_link'].match(/vimeo\.com\/(.*)/)[1];
        }
      }
      html = `
      <div class="activity ${this.published() ? '' : 'unpublish'}">
        <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
        <p class="title lead">${this.activity['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(this.activity['post_time']).toDateString()}
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${this.activity['video_link']}" allowfullscreen></iframe>
            </div>
          </div>
          <div class="col-md-12">
            <div class="description">${this.activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'text':
      html = `
      <div class="activity ${this.published() ? '' : 'unpublish'}">
        <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
        <p class="title lead">${this.activity['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(this.activity['post_time']).toDateString()}
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          ${this.activity['text_image'] ? `<div class="col-md-12"><img src="${this.activity['text_image']}" class="img-responsive"></div>` : ''}
          <div class="col-md-12">
            <div class="description">${this.activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'code':
      // handle different links
      if(this.activity['code_link']){
        if(this.activity['code_link'].match(/jsfiddle\.net/) != null){
          this.activity['code_link'] = this.activity['code_link'] + 'embedded/';
        }else if(this.activity['code_link'].match(/plnkr\.co/) != null){
          this.activity['code_link'] = 'https://embed.plnkr.co/' + this.activity['code_link'].replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
        }
      }
      html = `
      <div class="activity ${this.published()? '' : 'unpublish'}">
        <h2 class="index">${this.index < 10 ? '0' + this.index : this.index}</h2>
        <p class="title lead">${this.activity['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(this.activity['post_time']).toDateString()}
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${this.activity['code_link']}" allowfullscreen></iframe>
            </div>
            <div class="description">${this.activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'file':
      // handle different links
      console.log(this.activity);
      if(this.activity['file_link']){
        if(this.activity['file_link'].match(/drive\.google\.com/) !== null && this.activity['file_link'].match(/id=(.*)/) !== null){
          this.activity['file_link'] = 'https://drive.google.com/embeddedfolderview?id=' + this.activity['file_link'].match(/id=(.*)/)[1] + '#list';
        }
      }
      html = `
      <div class="activity ${this.published()? '' : 'unpublish'}">
        <h2>${this.index < 10 ? '0' + this.index : this.index}</h2>
        <p class="title lead">${this.activity['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(this.activity['post_time']).toDateString()}
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="${this.activity['file_link']}" allowfullscreen></iframe>
            </div>
            <div class="description">${this.activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    case 'audio':
      html = `
      <div class="activity ${this.published()? '' : 'unpublish'}">
        <h2>${this.index < 10 ? '0' + this.index : this.index}</h2>
        <p class="title lead">${this.activity['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(this.activity['post_time']).toDateString()}
          Author/Publisher: <a href="#">Dr. Abel Sanchez</a>
        </p>
        <div class="row">
          <div class="col-md-12">
            <img src="${this.activity['audio_image']}" class="img-responsive">
          </div>
          <div class="col-md-12">
            <audio controls>
              <source src="${this.activity['audio_audio']}" type="audio/mpeg">
            </audio>
          </div>
          <div class="col-md-12">
            <div class="description">${this.activity['description']}</div>
          </div>
        </div>
        ${activityComment}
        ${activityControl}
      </div>`;
      break;
    default:
      html = `
      <div class="activity">
        <h4>${this.index < 10 ? '0' + this.index : this.index}</h4>
        <p><i>Error occur when rendering activity</i></p>
      </div>`;
  }
  Template.call(this, $(html));
};

ActivityTemplate.prototype.updateIndex = function(index)
{
  this.index = index++;
  console.log(this.activity, index);
  console.log(this.$template);
  this.$template.find(".index").html(index < 10 ? '0' + index : index);
}

$.extend(ActivityTemplate.prototype, Activity.prototype, Template.prototype);

function BoardDetailTemplate(board)
{
  /* this.variables:
    board: the object stores the board data
    $template a jQuery object which stores the html content of this board
    $html a jQuery object which stores the the brief html content of this board
  */

  Board.call(this, board);
  var follow_html = '<span class="glyphicon glyphicon-envelope"></span>&nbsp subscribe</button>';
  var unfollow_html = '<span class="glyphicon glyphicon-remove"></span>&nbsp unsubscribe';
  var following_html = '<span class="glyphicon glyphicon-ok"></span>&nbsp subscribed';
  var html = `
    <div class="row">
      <div class="col-md-9">
        <h3 class="title board_title">`+this.board.title+`</h3>
        <div class="row">
          <div class="col-md-1 col-sm-1 col-xs-1" style="width: 70px">
            <p class="title">Author: </p>
          </div>
          <div class="col-md-1 col-sm-1 col-xs-1">
            <a href="#">`+this.board.author+`</a>
          </div>
        </div>
        <div class="row">
          <div class="col-md-1 col-sm-1 col-xs-1" style="width: 70px">
            Level:
          </div>
          <div class="col-md-1 col-sm-1 col-xs-1">
            <span class="board_level title">`+this.getLevelName()+`</span>
          </div>
        </div>
        <div class="action" style="margin-top: 15px">
          <button type="button" class="btn btn-default followBtn">
          <button type="button" class="btn btn-default endorseBtn">Endorse</button>
          <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-send"></span>&nbsp share</button>
        </div>
        <br/>
        <div class="row board_status">
          <div class="col-sm-3 col-xs-6">
            <span class="glyphicon glyphicon-book" style="width: 45px" aria-hidden="true"></span><span>`+ this.board.activity_num+(this.board.activity_num_all ? `(+${this.board.activity_num_all - this.board.activity_num})` : '')+' '+(this.board.activity_num == 1? "activity": "activities")+`</span>
          </div>
          <div class="col-sm-3 col-xs-6">
            <span aria-hidden="true" class="glyphicon glyphicon-pushpin" style="width: 45px"></span><span>`+ this.board.endorsed_num + ` endorsed </span>
          </div>
          <div class="col-sm-3 col-xs-6">
            <span aria-hidden="true" class="glyphicon glyphicon-education" style="width: 45px"></span><span>`+
            this.board.completed_num + ` completed </span>
          </div>
          <div class="col-sm-3 col-xs-6">
            <span aria-hidden="true" class="glyphicon glyphicon-play" style="width: 45px"></span><span class="following_num">`+
              this.board.following_num + ` subscribing
            </span>
          </div>
        </div>
        <br>
        <div class="row progressBox">
          <div class="progress">
            <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
              <span>60%</span>
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
        <h4>Tags</h4>
        <div class="tagList">`;
      var length = this.board.tags.length;
      if (length === 0) html += "This board currently has no tags.";
      else {
        html+=
          `<ul>`;
        if(this.board.tags && length > 0){
          for(var i = 0; i < length; i++){
            html += `<li>${this.board.tags[i].tag}</li>`;
          }
        }
        html +=
          `</ul>`;
      }
        html += `
        </div>
      </div>
    </div>
  `;

  Template.call(this, $(html));

  $template = this.$template;
  $followBtn = $template.find(".followBtn");

  $followBtn.hover(
    function(){if(board.followed) $(this).html(unfollow_html);},
    function(){if(board.followed) $(this).html(following_html);}
  );
  if (!board.followed) $followBtn.html(follow_html);
  else $followBtn.html(following_html);

  if (localStorage['is_staff'] !== "true")
  {
    $template.find(".endorseBtn").addClass("hidden");
  }
  else
  {
    if (localStorage.user_id == this.board.id)
    {
      $template.find(".endorseBtn").addClass("hidden");
    }
    $followBtn.addClass("hidden");
  }
  $followBtn.on('click', function(){
  if(board.followed)
  {
    $.post(serv_addr+'/activity/unfollow/', {user_id: localStorage.user_id, lb_id: board.id}, function(data)
    {
      if (data.ok)
      {
        board.following_num -= 1;
        board.followed = false;
        $followBtn.html(follow_html);
        $template.find(".following_num").html(board.following_num + ' subscribing');
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
        $followBtn.html(unfollow_html);
        $template.find(".following_num").html(board.following_num + ' subscribing');
      }
    });
  }
  });

  console.log(board.activities);

  var count = 0;
  $actList = $template.find(".activityList");
  var activities = this.board.activities;
  var length = this.board.activities.length;
  var actList = new ActivityListTemplate(activities, false);
  actList.display($actList);
  /*
  for (var i = 0; i < length; ++i)
  {
    var act = new ActivityTemplate(activities[i], i);
    if (act.published()) {
      act.display($actList);
      count++;
    }
  }
  if (count === 0)
  {
    $actList.append(`<p class="text-center noActivity"><i>Currently there are no activity in this board</i></p>`);
  }
  */
};

$.extend(BoardDetailTemplate.prototype, Board.prototype, Template.prototype);

function BoardBriefTemplate(board)
{
  Board.call(this, board);
  var html = '<div class="col-md-3 '+this.getLevelName()+'" data-id="'+this.board.id+'" myclass="boardTemplate_'+this.board.id+'">\
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
$.extend(BoardBriefTemplate.prototype, Board.prototype, Template.prototype);

function ActivityListTemplate(activities, sortable)
{
  // inherits ListTemplate

  this.activities = activities;

  var _templateList = [];

  var count = 0;
  for (var i = 0; i < activities.length; ++i)
  {
    var act = new ActivityTemplate(activities[i], count);
    if (act.published() || sortable === true)
    {
      _templateList.push(act);
      count++;
    }
  }

  // inner container
  $frame = $(`
    <div class="listFrame">
      <p class="text-right ${sortable ? '' : 'hidden'}">
        <button type="button" class="btn btn-default btn-sm sortLockMode">Sorting Enabled</button>
      </p>
      <div class="activityList ${sortable ? '' : 'viewMode'}">
      </div>
    </div>`
  );
  $container = $frame.find(".activityList");
  if (count === 0)
  {
    $container.append(`<p class="text-center noActivity"><i>Currently there are no activity in this board</i></p>`);
  }
  if (sortable)
  {
    $container.sortable({
      cancel: '.noActivity',
      opacity: 0.95,
      cursor: 'move'
    });
    var startIndex = -1, endIndex = -1;
    $container.on('sortstart', function(e, ui)
    {
      startIndex = ui.item.index();
    });
    $container.on('sortupdate', function(e, ui)
    {
      var target = _templateList[startIndex];
      endIndex = ui.item.index();
      for (var i = startIndex; i > endIndex; --i)
      {
        // startIndex > endIndex
        _templateList[i] = _templateList[i-1];
        _templateList[i].updateIndex(i);
      }
      for (var i = startIndex; i < endIndex; ++i)
      {
        // endIndex > startIndex
        _templateList[i] = _templateList[i+1];
        _templateList[i].updateIndex(i);
      }
      _templateList[endIndex] = target;
      target.updateIndex(endIndex);
      var order = {};
      for (var i = 0; i < _templateList.length; ++i)
      {
        order[_templateList[i].activity.id] = i;
      }
      $.post(serv_addr+'/activity/orderchange/', order);
    });

    var enabled = true;
    $frame.find(".sortLockMode").on("click", function()
    {
      if (enabled)
      {
        $container.sortable("disable");
        $(this).text("Sorting Disabled");
        enabled = false;
      }
      else
      {
        enabled = true;
        $container.sortable("enable");
        $(this).text("Sorting Enabled");
      }
    });
  }
  ListTemplate.call(this, _templateList, $frame, $container);
}

ActivityListTemplate.prototype.addActivity = function(activity)
{
  var index = this.activities.length;
  this.activities[index] = activity;
  var act = new ActivityTemplate(activity, index);
  this._templateList.push(act);
  act.display(this.$_container);
}

ActivityListTemplate.prototype.updateActivity = function(activity, index)
{
  activity.id = activity.activity_id;
  this.activities[index] = activity;
  var act = this._templateList[index];
  act.render(activity);
  this.$_container.find('.activity:eq('+index+')').replaceWith($(act.$template));
}

$.extend(ActivityListTemplate.prototype, ListTemplate.prototype);
