define(['util', 'mdls/User', 'mdls/Board', 'temps/Template', 'temps/ActivityTemplate', 'temps/ActivityListTemplate', 'temps/ActivityActionControl'], function (util, User, Board, Template, ActivityTemplate, ActivityListTemplate, ActivityActionControl) {
  var BoardDetailTemplate = function(board)
  {
    /* this.variables:
      model: the model object stores the board data
      $template a jQuery object which stores the html content of this board
    */

    this.model = new Board(board);
    var $this = this;
    var model = this.model;
    var subscribe_html = '<span class="glyphicon glyphicon-envelope"></span>&nbsp subscribe</button>';
    var unsubscribe_html = '<span class="glyphicon glyphicon-remove"></span>&nbsp unsubscribe';
    var subscribing_html = '<span class="glyphicon glyphicon-ok"></span>&nbsp subscribed';
    var html = `
      <div class="row">
        <div class="col-md-8">
          <h3 class="title board_title">`+util.toTitle(model.title)+`</h3>
          <div class="row">
            <div class="col-xs-1" style="width: 70px">
              <p class="title">Author: </p>
            </div>
            <div class="col-xs-1">
              <a href="profile.html?${model.author.id}" target="_blank">`+model.author.username+`</a>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-1" style="width: 70px">
              Level:
            </div>
            <div class="col-xs-1">
              <span class="board_level title">`+model.getLevelName()+`</span>
            </div>
          </div>
          <div class="action" style="margin-top: 15px">
            <button type="button" class="btn btn-default subscribeBtn">
            <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-send"></span>&nbsp share</button>
          </div>
          <br/>
          <div class="row board_status">
            <div class="col-xs-4">
              <span class="glyphicon glyphicon-book" style="width: 45px" aria-hidden="true"></span><span>`+ model.activity_num+(model.activity_num_all ? `(+${model.activity_num_all - model.activity_num})` : '')+' '+(model.activity_num == 1? "activity": "activities")+`</span>
            </div>
            <div class="col-xs-4">
              <span aria-hidden="true" class="glyphicon glyphicon-education" style="width: 45px"></span><span>`+
              model.completed_num + ` completed </span>
            </div>
            <div class="col-xs-4">
              <span aria-hidden="true" class="glyphicon glyphicon-play" style="width: 45px"></span><span class="subscribing_num">`+
                model.subscribing_num + ` subscribing
              </span>
            </div>
          </div>
          <br>
          <div class="progressBox">
            <div class="progress">
              <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="${model.getCompletedPercentage()}" aria-valuemin="0" aria-valuemax="100" style="width: ${model.getCompletedPercentage()}%;">
                <span style="color: white">${model.getCompletedPercentage()}%</span>
              </div>
            </div>
          </div>
          <div class="activityList">
          </div>`;
        html += `
        </div>
        <div class="col-md-offset-1 col-md-3">
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
    var $subscribeBtn = $template.find(".subscribeBtn");

    Template.call(this, $template);
    this.$subscribeBtn = $subscribeBtn;

    console.log(model.subscribing);
    $subscribeBtn.hover(
      function(){if(model.subscribing) $(this).html(unsubscribe_html);},
      function(){if(model.subscribing) $(this).html(subscribing_html);}
    );
    if (!model.subscribing) $subscribeBtn.html(subscribe_html);
    else $subscribeBtn.html(subscribing_html);

    if (User.is_staff() === "true")
    {
      // the board of itself
      console.log(model);
      $subscribeBtn.addClass("hidden");
    }
    $subscribeBtn.on('click', function(){
      if(model.subscribing)
      {
        util.post(
          '/lb/subscribe/'+model.id,
          {subscribe: false},
          function(res) {
            var data = res.data;
            console.log(res);
            if (res.success)
            {
              model.subscribing_num -= 1;
              model.subscribing = false;
              $subscribeBtn.html(subscribe_html);
              $template.find(".subscribing_num").html(model.subscribing_num + ' subscribing');
            }
          }
        );
      }
      else
      {
        util.post(
          '/lb/subscribe/'+model.id,
          {subscribe: true},
          function(res)
          {
            if (res.success)
            {
              model.subscribing_num += 1;
              model.subscribing = true;
              $subscribeBtn.html(unsubscribe_html);
              $template.find(".subscribing_num").html(model.subscribing_num + ' subscribing');
            }
          }
        );
      }
    });

    $actList = $template.find(".activityList");
    var length = model.activities.length;

    var parent = this;
    var constructor = function(ele, i) {
        var act_t = new ActivityTemplate(ele, i);
        var act_c = new ActivityActionControl(act_t);
        act_c.register(parent);
        act_t.addControl(act_c);
        return act_t;
      }
    this.actTemps = model.activities.map(constructor);

    var actList = new ActivityListTemplate(this.actTemps, false);
    actList.display($actList);
  };

  $.extend(BoardDetailTemplate.prototype, Template.prototype);

  BoardDetailTemplate.prototype.onActivityComplete = function(model) {
    console.log("here");
    var progrssElement = this.$template.find('.progressBox .progress-bar');
    var percentagePerActivity = !this.model.activity_num ? 0 : Math.ceil(100 / this.model.activity_num);
    var currentPercentage = parseInt(progrssElement.attr('aria-valuenow'));
    if (model.completed) {
      currentPercentage += percentagePerActivity;
      if (currentPercentage > 100) currentPercentage = 100;
      progrssElement.css('width', currentPercentage + '%').attr('aria-valuenow', currentPercentage);
      progrssElement.find('span').text(currentPercentage + '%');
    } else {
      currentPercentage -= percentagePerActivity;
      if (currentPercentage < 0) currentPercentage = 0;
      progrssElement.css('width', currentPercentage + '%').attr('aria-valuenow', currentPercentage);
      progrssElement.find('span').text(currentPercentage + '%');
    }
  }

  return BoardDetailTemplate;

});
