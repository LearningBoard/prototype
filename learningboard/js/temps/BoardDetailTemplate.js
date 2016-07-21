define(['util', 'temps/Board', 'temps/Template', 'temps/CommentableTemplate', 'temps/ActivityTemplate', 'temps/ActivityListTemplate'], function (util, Board, Template, CommentableTemplate, ActivityTemplate, ActivityListTemplate) {
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
        <div class="col-md-8">
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
          <div class="activityList">
          </div>`;
        html += `
        </div>
        <div class="col-md-4">
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

    var $template = this.$template;
    var $followBtn = $template.find(".followBtn");

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
      $.post(serv_addr+'/lb/unfollow/', {user_id: localStorage.user_id, lb_id: board.id}, function(data)
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
      $.post(serv_addr+'/lb/follow/'+board.id, {user_id: localStorage.user_id}, function(data)
      {
        if (data.ok)
        {
          board.following_num += 1;
          board.followed = true;
          $followBtn.html(unfollow_html);
          $template.find(".following_num").html(board.following_num + ' subscribing');
        }
      });
    }
    });

    // endorse button
    $('.endorseBtn').on('click', function(){
      if($(this).hasClass('btn-primary')){
        $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) - 1);
        $(this).removeClass('btn-primary');
      }else{
        $('.progress_endorsed').text(parseInt($('.progress_endorsed').text()) + 1);
        $(this).addClass('btn-primary');
      }
    });

    // mark as complete button
    $(document).on('click', '.markAsComplete', function(){
      if($(this).attr('style')){
        $(this).css('color', '');
      }else{
        $(this).css('color', 'green');
      }
    });

    // like activity button
    $(document).on('click', '.activity .comment .glyphicon-heart', function(e){
      if($(this).attr('style')){
        $(this).css('color', '');
      }else{
        $(this).css('color', 'red');
      }
    });

    $actList = $template.find(".activityList");
    var length = board.activities.length;

    this.actTemps = util.arrayMapping(board.activities, function(activity, i)
    {
      return new CommentableTemplate(new ActivityTemplate(board.activities[i], i));
    });

    var actList = new ActivityListTemplate(this.actTemps, false);
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

  return BoardDetailTemplate;

})
