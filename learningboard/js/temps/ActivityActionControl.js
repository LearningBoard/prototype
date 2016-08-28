define(['util', 'mdls/User', "temps/ControlTemplate"], function (util, User, ControlTemplate) {

  var ActivityActionControl = function(actTemp) {

    var $html;
    this.model = actTemp.model;

    $html = $(`
      <div class="control" data-id="${this.model.id}">
        <ul class="text-muted">
          <li>
            <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
            Share
          </li>
          <li class="markAsComplete ${this.model.completed ? 'text-success' : ''}">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            Complete
          </li>
        </ul>
      </div>
   `);

    ControlTemplate.call(this, $html);

  };

  $.extend(ActivityActionControl.prototype, ControlTemplate.prototype);

  ActivityActionControl.prototype.onActive = function() 
  {
    var parent = this;
    // mark as complete button
    this.$template.find('.markAsComplete').on('click', function() {
      if (!User.hasToken()) {
        alert('This feature requires login');
        return;
      }
      var $this = $(this);
      util.post('/activity/complete/'+parent.model.id, {complete: !parent.model.completed},
        function(res) {
          $this.toggleClass('text-success');
          parent.model.completed = !parent.model.completed;
          var len = parent.subscribers.length;
          for (var ii = 0; ii < len; ++ii)
          {
            var ele = parent.subscribers[ii];
            if (ele.onActivityComplete) 
              ele.onActivityComplete(parent.model);
          }
        }
      );
    });

  }

  return ActivityActionControl;
});
