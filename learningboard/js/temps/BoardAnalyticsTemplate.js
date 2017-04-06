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
          <div class="table-responsive">
            <table class="table table-bordered table-condensed">
              <thead>
                <tr>
                  <th>View Session</th>
                  <th>User Viewed</th>
                </td>
              </thead>
              <tbody>
                <tr>
                  <td><span class="stat_view_session">N/A</span></td>
                  <td><span class="stat_user_viewed">N/A</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <p class="text-muted">
              <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Replay
            </p>
            <select name="replay">
              <option value="">Select a session to replay</option>
            </select>
          </div>
          <div>
            <p class="text-muted">
              <span class="glyphicon glyphicon-stats" aria-hidden="true"></span>
              Aggregate Data
            </p>
            <ul>
              <li>
                <button type="button" class="btn btn-default btn-sm allClicks">Display All Clicks</button>
              </li>
              <li>
                <input type="text" size="3" name="user" placeholder="0" /> Random users<br />
                Click between <input type="text" size="3" name="click1" placeholder="0" /> - <input type="text" size="3" name="click2" placeholder="0" />
                <button type="button" class="btn btn-default btn-sm randomClickDisplay">Display</button>
              </li>
            </ul>
          </div>
          <div class="totalClick badge" title="Total clicks" style="position:fixed;z-index:100;top:15px;left:20px;font-size:15px;"></div>
          <div class="timer badge" title="Timer" style="position:fixed;z-index:100;top:40px;left:20px;font-size:15px;"></div>
          <div class="currenttab badge" style="position:fixed;z-index:100;top:65px;left:20px;font-size:12px;"></div>
        </div>`;
        break;
      default:
        html = '<div></div>';
    }
    html = $(html);
    Template.call(this, html);

    // logic
    if (parent.mode === util.constant.VIEW_MODE) {
      $(window).on('blur focus', function(e) {
        var prevType = $(this).data('prevType');
        var interactingOER = $(this).data('interactingOER');
        if (prevType != e.type && interactingOER == false) {
          util.post('/analytics', {
            user: User.getId(),
            lb: parent.model.id,
            session: parent.uuid,
            data: {
              action: 'inCurrentTab',
              status: (e.type === 'focus')
            },
            createdAt: new Date()
          });
        }
        $(this).data('prevType', e.type);
      });
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
        $this.$template.find('select[name=replay]').on('change', function(e) {
          e.preventDefault();
          var data = dataSet.session[this.value];
          // clear all unfinish works
          clearInterval(timer);
          for (var x = 0; x < action.length; x++) {
            clearTimeout(action[x]);
          }
          // reset existing drawing
          $this.$template.find('.totalClick').text('').hide();
          $this.$template.find('.timer').text('').css('background-color', 'green').hide();
          $this.$template.find('.currenttab').text('').hide();
          $('body').find('.analyticsPoint').empty();
          if (!data) return false;
          // count total click
          var totalClick = data.reduce(function(total, current) {
            if (current.data.action == 'click') total++;
            return total;
          }, 0);
          // render new drawing
          var lastTime = 0, delay = 1000, currentClick = 1, executed = 0;
          for (var i = 0; i < data.length; i++) {
            if (i !== 0) {
              delay += moment(data[i].createdAt).diff(moment(lastTime));
            }
            // draw points
            (function(data, lastClickTime, delay) {
              action.push(setTimeout(function() {
                if (!data.activity) {
                  switch(data.data.action) {
                    case 'click':
                      $('body').find('.analyticsPoint').append(
                        `<div style="position:absolute;margin-left:${data.data.x}px;margin-top:${data.data.y}px;z-index:1;padding-left:30px;cursor:help;" title="Clicked on: ${new Date(data.createdAt)}"><i class="fa fa-mouse-pointer" style="font-size:25px;color:#72A540;"></i> ${currentClick++}<br />+ ${!lastClickTime ? 0 : (moment(data.createdAt).diff(moment(lastClickTime)))}ms</div>`
                      );
                      break;
                    case 'inCurrentTab':
                      if (data.data.status) {
                        $this.$template.find('.currenttab').text('').hide();
                      } else {
                        $this.$template.find('.currenttab').text('Not focusing').css('background', 'red').show();
                      }
                      break;
                  }
                } else {
                  parent.actTemps[data.activity.order].replay(data);
                }
                executed++;
              }, delay));
            })(data[i], lastTime, delay);
            lastTime = data[i].createdAt;
            // start timer
            if (i == 0) {
              var second = 0;
              setTimeout(function() {
                $this.$template.find('.totalClick').text(totalClick).show();
                $this.$template.find('.timer').text(second++).show();
                timer = setInterval(function() {
                  if (executed === data.length) {
                    $this.$template.find('.timer').css('background', 'red');
                    $this.$template.find('.currenttab').text('Exited').css('background', 'red').show();
                    clearInterval(timer);
                  }
                  $this.$template.find('.timer').text(second++);
                }, 1000);
              }, delay);
            }
          }
        });

        // Display all clicks
        $this.$template.find('button.allClicks').on('click', function() {
          // reset
          $this.$template.find('select[name=replay] option:first').prop('selected', true);
          $this.$template.find('select[name=replay]').trigger('change');

          $.each(dataSet.session, function(id, value) {
            var color = "#"+((1<<24)*Math.random()|0).toString(16);
            var lastClickTime = 0;
            $.each(value, function(index, data) {
              if (data.data.action === 'click') {
                $('body').find('.analyticsPoint').append(
                  `<div style="position:absolute;margin-left:${data.data.x}px;margin-top:${data.data.y}px;z-index:1;padding-left:30px;cursor:help;" title="Clicked on: ${new Date(data.createdAt)}"><i class="fa fa-mouse-pointer" style="font-size:25px;color:${color}"></i> ${index}<br />+ ${!lastClickTime ? 0 : (moment(data.createdAt).diff(moment(lastClickTime)))}ms</div>`
                );
                lastClickTime = data.createdAt;
              }
            });
          });
        });

        // Display clicks from random users
        $this.$template.find('button.randomClickDisplay').on('click', function() {
          // reset
          $this.$template.find('select[name=replay] option:first').prop('selected', true);
          $this.$template.find('select[name=replay]').trigger('change');

          var selectTotal = $(this).parents('div').find('input[name=user]').val();
          var fromClick = $(this).parents('div').find('input[name=click1]').val();
          var toClick = $(this).parents('div').find('input[name=click2]').val();
          var selected = [];
          if (!selectTotal) selectTotal = 0;
          if (!fromClick) fromClick = 0;
          if (!toClick) toClick = 0;
          var sessionKey = Object.keys(dataSet.session);
          while (selected.length < selectTotal && selected.length != sessionKey.length) {
            var index = Math.floor(Math.random() * sessionKey.length);
            if (selected.indexOf(dataSet.session[sessionKey[index]]) === -1) {
              selected.push(dataSet.session[sessionKey[index]]);
            }
          }
          $.each(selected, function(id, value) {
            var color = "#" + ((1<<24) * Math.random()|0).toString(16);
            var lastClickTime = 0;
            var filteredValue = value.reduce(function(array, current) {
              if (current.data.action == 'click') {
                array.push(current);
              }
              return array;
            }, []);
            $.each(filteredValue, function(index, data) {
              if (index >= fromClick && index <= toClick) {
                $('body').find('.analyticsPoint').append(
                  `<div style="position:absolute;margin-left:${data.data.x}px;margin-top:${data.data.y}px;z-index:1;padding-left:30px;cursor:help;" title="Clicked on: ${new Date(data.createdAt)}"><i class="fa fa-mouse-pointer" style="font-size:25px;color:${color}"></i> ${index}<br />+ ${!lastClickTime ? 0 : (moment(data.createdAt).diff(moment(lastClickTime)))}ms</div>`
                );
              }
              lastClickTime = data.createdAt;
            });
          });
        });

      }, function(err) {
        alert('Cannot retrieve analytics data');
      });
    }
  };

  $.extend(BoardAnalyticsTemplate.prototype, Template.prototype);

  return BoardAnalyticsTemplate;

});
