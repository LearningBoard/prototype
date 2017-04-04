define(['util', 'mdls/User', 'mdls/Activity', 'temps/ListElementTemplate', 'temps/CommentableTemplate', 'temps/ActivityEditControl', 'temps/ActivityActionControl', 'temps/ActivityAnalyticsTemplate', 'lib/ViewDispatcher'], function(util, User, Activity, ListElementTemplate, CommentableTemplate, ActivityEditControl, ActivityActionControl, ActivityAnalyticsTemplate, ViewDispatcher) {
  "use strict";

  /**
   * @constructor
   * @param activity - the activity data
   * @param index - for the order of displaying
   * @param BoardDetailTemplate - the board detail template
   */
  var ActivityTemplate = function(activity, index, mode)
  {
    this.model = new Activity(activity);
    this.controller = null;
    this.mode = mode;

    ListElementTemplate.call(this, this._get_html(this.model, index), index);
  };

  $.extend(ActivityTemplate.prototype, ListElementTemplate.prototype);

  ActivityTemplate.prototype._get_html = function(model, index)
  {
    index++;
    var $html = $(`
      <div class="activity ${model.published() ? '' : 'unpublish'}">
        <div class="analyticsTool"></div>
        <h2 class="index">${index < 10 ? '0' + index : index}</h2>
        <p class="title lead">${model['title']}</p>
        <p class="text-muted">
          Posted date: ${new Date(model.createdAt).toDateString()}<br/>
          Author/Publisher: <a href="profile.html?${model.author.id}" target="_blank">${model.author.username}</a>
        </p><br/>
        <div class="row">
          <div class="col-md-12">
            <div name="dif"> </div>
          </div>
          <div class="col-md-12">
            <div class="description">${model.description}</div>
          </div>
        </div>
        <div class="activityControl"></div>
        <div class="activityComment"></div>
      </div>
    `);
    var $dif = $html.find("[name='dif']");
    var $this = this;
    ViewDispatcher.activities.getView(model.type).then(function(temp) {
      var rsc = new temp(model.data, model, $this.mode);
      rsc.display($dif);
      $this.contentTemplate = rsc;
    }).catch(function(err) {
      throw err;
    });

    if (this.mode === util.constant.VIEW_MODE) {
      var $activityComment = $html.find('div.activityComment');
      var commentTemp = new CommentableTemplate(model);
      commentTemp.display($activityComment);
    }

    if (this.mode === util.constant.ANALYTICS_MODE) {
      var analyticsTemp = new ActivityAnalyticsTemplate(this.model.id);
      analyticsTemp.display($html.find('.analyticsTool'));
    }

    // Log iframe behavior
    $html.find('.description iframe').each(function(i, value) {
      var iframeHeight = $(value).attr('height') || 400;
      var parent = $(value).wrap(`<div class="iframe_logger" \
                style="height:${iframeHeight}px;overflow:auto;"></div>`
      ).attr({
        height: '1000%',
        scrolling: 'no'
      }).parent('.iframe_logger');
      parent.prepend('<div style="position:absolute;width:94%;height:100%;margin:0;padding:0;z-index:100;"></div>');
      parent.find('div').on('click', function(e) {
        $(this).css('z-index', -1);
        (function(ele) {
          setTimeout(function(){
            ele.css('z-index', 100);
          }, 1000);
        })($(this));
      });
      parent.on('mouseover mouseleave', function(e) {
        switch (e.type) {
          case 'mouseover':
            $(window).data('interactingOER', true);
            break;
          case 'mouseleave':
            $(window).data('interactingOER', false);
            $html.find('div:first').focus();
            break;
        }
      });
      parent.on('scroll', function(e) {
        if ($this.mode !== util.constant.VIEW_MODE) return false;
        util.post('/analytics', {
          user: User.getId(),
          lb: $this.model.lb,
          activity: $this.model.id,
          session: $this.model.session,
          data: {
            action: 'iframescroll',
            current: $(this).scrollTop(),
            src: $(value).attr('src')
          },
          createdAt: new Date()
        });
      });
    });

    return $html;
  };

  ActivityTemplate.prototype.updateIndex = function(index)
  {
    this.index = index;
    index++;
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  ActivityTemplate.prototype.update = function(model, index)
  {
    if (index === undefined) index = this.index;
    var new_html = this._get_html(model, index);
    this.model = model;
    this.$template.replaceWith(new_html);
    this.$template = new_html;
    this.controller.display(this.$template.find(".activityControl"));
  }

  ActivityTemplate.prototype.addControl = function(ctrl)
  {
    this.controller = ctrl;

    ctrl.display(this.$template.find(".activityControl"));

    return this;
  }

  ActivityTemplate.prototype.replay = function(data)
  {
    switch(data.data.action) {
      case 'iframescroll':
        this.$template.find('.description iframe').each(function(i, value) {
          if ($(value).attr('src') == data.data.src) {
            $(value).parent('.iframe_logger').animate({
              scrollTop: data.data.current
            }, 50);
            return false;
          }
        });
        break;
    }
    if (typeof this.contentTemplate.replay === 'function') {
      this.contentTemplate.replay(data);
    }
  };

  return ActivityTemplate;
});
