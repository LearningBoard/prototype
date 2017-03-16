define(['util', 'config', 'mdls/User', 'mdls/Board', 'temps/Template', 'temps/ActivityTemplate', 'temps/ActivityListTemplate', 'temps/ActivityActionControl', 'moment', 'facebook'], function (util, config, User, Board, Template, ActivityTemplate, ActivityListTemplate, ActivityActionControl, moment) {
  var BoardDetailTemplate = function(board, mode)
  {
    /* this.variables:
      model: the model object stores the board data
      $template a jQuery object which stores the html content of this board
    */

    this.model = new Board(board);
    this.mode = mode;
    this.uuid = util.uuid();
    var $this = this;
    var model = this.model;
    var subscribe_html = '<span class="glyphicon glyphicon-envelope"></span>&nbsp subscribe</button>';
    var unsubscribe_html = '<span class="glyphicon glyphicon-remove"></span>&nbsp unsubscribe';
    var subscribing_html = '<span class="glyphicon glyphicon-ok"></span>&nbsp subscribed';
    var html = `
      <div class="analyticsPoint"></div>
      <div class="row">
        <div class="col-md-8">
          <h3 class="title board_title">`+util.toTitle(model.title)+`</h3>
          <div class="row">
            <div class="col-xs-1" style="width: 70px">
              <p class="title">Owner: </p>
            </div>
            <div class="col-xs-1">
              <a href="profile.html?${model.author.id}" target="_blank">`+model.getOwnerName()+`</a>
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
            <button type="button" class="btn btn-default subscribeBtn"></button>
            <button type="button" class="btn btn-default shareBtn"><span class="glyphicon glyphicon-send"></span>&nbsp share</button>
          </div>
          <br/>
          <div class="row board_status">
            <div class="col-xs-4">
              <span class="glyphicon glyphicon-book" style="width: 45px" aria-hidden="true"></span><span>`+ model.activity_num+' '+(model.activity_num == 1? "activity": "activities")+`</span>
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
                <span style="color: #fff;">${model.getCompletedPercentage()}%</span>
              </div>
            </div>
          </div>
          <div class="activityList">
          </div>`;
        html += `
        </div>
        <div class="col-md-offset-1 col-md-3">
          <h4>About This ${config.componentName.singular}</h4>
          <div class="board_description">${model.description}</div>
        `;
        if (model.category) {
          html += `
          <h4>Category</h4>
          <p>${model.category.category}</p>`;
        }
        html += `
          <h4>Tags</h4>
          <div class="tagList">`;
        var length = model.tags.length;
        if (length === 0) html += `This ${config.componentName.singular} currently has no tags.`;
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
          <div class="analyticsTool"></div>
        </div>
      </div>
    `;

    var $template = $(html);
    Template.call(this, $template);

    var $subscribeBtn = $template.find(".subscribeBtn");
    $subscribeBtn.hover(
      function(){if(model.subscribing) $(this).html(unsubscribe_html);},
      function(){if(model.subscribing) $(this).html(subscribing_html);}
    );
    if (!model.subscribing) $subscribeBtn.html(subscribe_html);
    else $subscribeBtn.html(subscribing_html);

    $subscribeBtn.on('click', function(){
      if (!User.hasToken()) {
        alert('This feature requires login');
        return;
      } else if ($this.mode !== util.constant.VIEW_MODE) {
        alert('You can\'t subscribe in preview mode');
        return;
      }
      if(model.subscribing)
      {
        util.post(
          '/lb/subscribe/'+model.id,
          {subscribe: false},
          function(res) {
            var data = res.data;
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

    if (User.getId() === this.model.author.id && this.mode === util.constant.VIEW_MODE)
      $subscribeBtn.hide();

    var $shareBtn = $template.find(".shareBtn");
    $shareBtn.on("click", function(e) {
      e.preventDefault();
      FB.ui({
        method: "share",
        href: util.getAppRootUrl() + '/board_view.html?' + $this.model.id
      }, function(res) {
      });
    });

    if (this.mode !== util.constant.ANALYTICS_MODE) {
      $template.find('.analyticsTool').hide();
    }

    $actList = $template.find(".activityList");

    var length = 0;
    var constructor = function(array, ele) {
      if (!ele.publish) return array;
      ele.session = $this.uuid; // pass unique session id
      var act_t = new ActivityTemplate(ele, length++, $this.mode);
      var act_c = new ActivityActionControl(act_t);
      act_c.register($this);
      act_t.addControl(act_c);
      array.push(act_t);
      return array;
    }
    this.actTemps = model.activities.reduce(constructor, []);

    var actList = new ActivityListTemplate(this.actTemps, false);
    actList.display($actList);
  };

  $.extend(BoardDetailTemplate.prototype, Template.prototype);

  BoardDetailTemplate.prototype.display = function () {
    Template.prototype.display.apply(this, arguments);
    $this = this;

    if (this.mode === util.constant.VIEW_MODE) {
      this.$template.on('click', function(e) {
        var offset = $(this).offset();
        util.post('/analytics', {
          user: User.getId(),
          lb: $this.model.id,
          session: $this.uuid,
          data: {
            action: 'click',
            x: e.pageX - offset.left,
            y: e.pageY - offset.top
          },
          createdAt: new Date()
        });
      });
    } else if (this.mode === util.constant.ANALYTICS_MODE) {
      util.get('/analytics/lb/' + this.model.id, function(dataSet) {
        dataSet = dataSet.data;
        // render layout
        var html = `
        <h4>Analytics</h4>
        <p>Total view session: ${Object.keys(dataSet.session).length}</p>
        <p>Total user viewed: ${dataSet.totalUser}</p>
        <select>
          <option value="">---Please select a session---</option>`;
        $.each(dataSet.session, function(index, value) {
          html += `<option value="${index}">${index}</option>`;
        });
        html += `
        </select>
        <div class="totalClick badge" title="Total clicks" style="position:fixed;z-index:100;top:15px;left:20px;font-size:15px;"></div>
        <div class="timer badge" title="Timer" style="position:fixed;z-index:100;top:40px;left:20px;font-size:15px;"></div>`;
        var $analyticsArea = $this.$template.find('.analyticsTool');
        $analyticsArea.html(html);

        // logic
        var action = [], timer;
        $analyticsArea.find('select').on('change', function(e) {
          e.preventDefault();
          // test is empty dataSet
          try {
            var data = dataSet.session[this.value];
          } catch (err) {
            var data = [];
          }
          // clear all unfinish works
          clearInterval(timer);
          for (var x = 0; x < action.length; x++) {
            clearTimeout(action[x]);
          }
          // reset existing drawing
          $analyticsArea.find('.totalClick').text('').hide();
          $analyticsArea.find('.timer').text('').css('background-color', 'green').hide();
          $('body').find('.analyticsPoint').empty();
          // count total click
          var totalClick = data.reduce(function(total, current) {
            if (current.data.action == 'click') total++;
            return total;
          }, 0);
          // render new drawing
          var lastTime = 0, delay = 1000, index = 1, executed = 0;
          for (var i = 0; i < data.length; i++) {
            if (i !== 0) {
              delay += moment(data[i].createdAt).diff(moment(lastTime));
            }
            // draw points
            (function(index, data, lastClickTime, delay) {
              action.push(setTimeout(function() {
                if (!data.activity) {
                  $('body').find('.analyticsPoint').append(
                    `<div style="position:absolute;margin-left:${data.data.x}px;margin-top:${data.data.y}px;background:url(img/mouse_pointer.png) no-repeat;z-index:1;padding-left:30px;cursor:help;" title="Clicked on: ${new Date(data.createdAt)}">${index}<br />+ ${!lastClickTime ? 0 : (moment(data.createdAt).diff(moment(lastClickTime)))}ms</div>`
                  );
                } else {
                  if (typeof $this.actTemps[data.activity.order].contentTemplate.replay === 'function') {
                    $this.actTemps[data.activity.order].contentTemplate.replay(data);
                  }
                }
                executed++;
              }, delay));
            })(index, data[i], lastTime, delay);
            lastTime = data[i].createdAt;
            if (!data.activity) index++;
            // start timer
            if (i == 0) {
              var second = 0;
              setTimeout(function() {
                $analyticsArea.find('.totalClick').text(totalClick).show();
                $analyticsArea.find('.timer').text(second++).show();
                timer = setInterval(function() {
                  if (executed === totalClick) {
                    $analyticsArea.find('.timer').css('background', 'red');
                    clearInterval(timer);
                  }
                  $analyticsArea.find('.timer').text(second++);
                }, 1000);
              }, delay);
            }
          }
        });
      }, function(err) {
        alert('Cannot retrieve analytics data');
      });
    }
  }

  BoardDetailTemplate.prototype.onActivityComplete = function(model) {
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
  };

  return BoardDetailTemplate;

});
