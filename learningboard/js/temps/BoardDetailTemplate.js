define(['util', 'mdls/User', 'mdls/Board', 'temps/Template', 'temps/CommentableTemplate', 'temps/ActivityTemplate', 'temps/ActivityListTemplate'], function (util, User, Board, Template, CommentableTemplate, ActivityTemplate, ActivityListTemplate) {
  var BoardDetailTemplate = function(board)
  {
    /* this.variables:
      model: the model object stores the board data
      $template a jQuery object which stores the html content of this board
    */

    this.model = new Board(board);
    var model = this.model;
    var follow_html = '<span class="glyphicon glyphicon-envelope"></span>&nbsp subscribe</button>';
    var unfollow_html = '<span class="glyphicon glyphicon-remove"></span>&nbsp unsubscribe';
    var following_html = '<span class="glyphicon glyphicon-ok"></span>&nbsp subscribed';
    var html = `
      <div class="row">
        <div class="col-md-8">
          <h3 class="title board_title">`+util.toTitle(model.title)+`</h3>
          <div class="row">
            <div class="col-md-1 col-sm-1 col-xs-1" style="width: 70px">
              <p class="title">Author: </p>
            </div>
            <div class="col-md-1 col-sm-1 col-xs-1">
              <a href="#">`+model.author.username+`</a>
            </div>
          </div>
          <div class="row">
            <div class="col-md-1 col-sm-1 col-xs-1" style="width: 70px">
              Level:
            </div>
            <div class="col-md-1 col-sm-1 col-xs-1">
              <span class="board_level title">`+model.getLevelName()+`</span>
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
              <span class="glyphicon glyphicon-book" style="width: 45px" aria-hidden="true"></span><span>`+ model.activity_num+(model.activity_num_all ? `(+${model.activity_num_all - model.activity_num})` : '')+' '+(model.activity_num == 1? "activity": "activities")+`</span>
            </div>
            <div class="col-sm-3 col-xs-6">
              <span aria-hidden="true" class="glyphicon glyphicon-pushpin" style="width: 45px"></span><span>`+ model.endorsed_num + ` endorsed </span>
            </div>
            <div class="col-sm-3 col-xs-6">
              <span aria-hidden="true" class="glyphicon glyphicon-education" style="width: 45px"></span><span>`+
              model.completed_num + ` completed </span>
            </div>
            <div class="col-sm-3 col-xs-6">
              <span aria-hidden="true" class="glyphicon glyphicon-play" style="width: 45px"></span><span class="following_num">`+
                model.following_num + ` subscribing
              </span>
            </div>
          </div>
          <br>
          <div class="row progressBox">
            <div class="progress">
              <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="${model.getCompletedPercentage()}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.getCompletedPercentage()}%;">
                <span>${model.getCompletedPercentage()}%</span>
              </div>
            </div>
          </div>
          <div class="activityList">
          </div>`;
        html += `
        </div>
        <div class="col-md-4">
          <h4>About This Board</h4>
          <div class="board_description">${model.description}</div>
          <h4>Tags</h4>
          <div class="tagList">`;
        var length = model.tags.length;
        if (length === 0) html += "This board currently has no tags.";
        else {
          html+=
            `<ul>`;
          if(model.tags && length > 0){
            for(var i = 0; i < length; i++){
              html += `<li>${model.tags[i].tag}</li>`;
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

    var $template = $(html);
    var $followBtn = $template.find(".followBtn");

    Template.call(this, $template);
    this.$followBtn = $followBtn;

    $followBtn.hover(
      function(){if(model.following) $(this).html(unfollow_html);},
      function(){if(model.following) $(this).html(following_html);}
    );
    if (!model.following) $followBtn.html(follow_html);
    else $followBtn.html(following_html);

    if (User.is_staff() !== "true")
    {
      $template.find(".endorseBtn").addClass("hidden");
    }
    else
    {
      // the board of itself
      console.log(model);
      if (localStorage.user_id == model.id)
      {
        $template.find(".endorseBtn").addClass("hidden");
      }
      $followBtn.addClass("hidden");
    }
    $followBtn.on('click', function(){
      if(model.following)
      {
        util.post(
          '/lb/follow/'+model.id,
          {follow: false},
          function(res) {
            var data = res.data;
            console.log(res);
            if (res.success)
            {
              model.following_num -= 1;
              model.following = false;
              $followBtn.html(follow_html);
              $template.find(".following_num").html(model.following_num + ' subscribing');
            }
          }
        );
      }
      else
      {
        util.post(
          '/lb/follow/'+model.id,
          {follow: true},
          function(res)
          {
            if (res.success)
            {
              model.following_num += 1;
              model.following = true;
              $followBtn.html(unfollow_html);
              $template.find(".following_num").html(model.following_num + ' subscribing');
            }
          }
        );
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

    $actList = $template.find(".activityList");
    var length = model.activities.length;

    this.actTemps = util.arrayMapping(model.activities, function(ele, i)
    {
      return new CommentableTemplate(new ActivityTemplate(ele, i));
    });

    var actList = new ActivityListTemplate(this.actTemps, false);
    actList.display($actList);
  };

  $.extend(BoardDetailTemplate.prototype, Template.prototype);

  return BoardDetailTemplate;

})
