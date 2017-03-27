define(['util', 'mdls/User', 'temps/Template', 'moment'], function (util, User, Template, moment) {

  var BoardAnalyticsTemplate = function(parent) {
    var $this = this;
    var html;

    // render layout
    switch (parent.mode) {
      case util.constant.ANALYTICS_MODE:
        html = `
        <div>
          <h4>Analytics</h4>
          <p>Total view session: <span class="stat_view_session">N/A</span></p>
          <p>Total user viewed: <span class="stat_user_viewed">N/A</span></p>
          <select>
            <option value="">Select a session to replay</option>
          </select>
          <div class="totalClick badge" title="Total clicks" style="position:fixed;z-index:100;top:15px;left:20px;font-size:15px;"></div>
          <div class="timer badge" title="Timer" style="position:fixed;z-index:100;top:40px;left:20px;font-size:15px;"></div>
        </div>`;
        break;
      default:
        html = '<div></div>';
    }
    html = $(html);
    Template.call(this, html);

    // logic
    if (parent.mode === util.constant.VIEW_MODE) {
      parent.$template.on('click', function(e) {
        var offset = $(this).offset();
        util.post('/analytics', {
          user: User.getId(),
          lb: parent.model.id,
          session: parent.uuid,
          data: {
            action: 'click',
            x: e.pageX - offset.left,
            y: e.pageY - offset.top
          },
          createdAt: new Date()
        });
      });
    } else if (parent.mode === util.constant.ANALYTICS_MODE) {
      util.get('/analytics/lb/' + parent.model.id, function(dataSet) {
        dataSet = dataSet.data;

        // update layout
        $this.$template.find('.stat_view_session').text(Object.keys(dataSet.session).length);
        $this.$template.find('.stat_user_viewed').text(dataSet.totalUser);
        $.each(dataSet.session, function(index, value) {
          $this.$template.find('select').append(`<option value="${index}">${index}</option>`);
        });

        // replay
        var action = [], timer;
        $this.$template.on('change', 'select', function(e) {
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
          $this.$template.find('.totalClick').text('').hide();
          $this.$template.find('.timer').text('').css('background-color', 'green').hide();
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
                  parent.actTemps[data.activity.order].replay(data);
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
                $this.$template.find('.totalClick').text(totalClick).show();
                $this.$template.find('.timer').text(second++).show();
                timer = setInterval(function() {
                  if (executed === totalClick) {
                    $this.$template.find('.timer').css('background', 'red');
                    clearInterval(timer);
                  }
                  $this.$template.find('.timer').text(second++);
                }, 1000);
              }, delay);
            }
          }
        });
      }, function(err) {
        alert('Cannot retrieve analytics data');
      });
    }
  };

  $.extend(BoardAnalyticsTemplate.prototype, Template.prototype);

  return BoardAnalyticsTemplate;

});
