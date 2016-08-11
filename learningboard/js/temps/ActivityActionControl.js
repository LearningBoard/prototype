define(['util', "temps/ControlTemplate"], function (util, ControlTemplate) {

  var ActivityActionControl = function(actTemp) {

    var $html;
    var model = actTemp.model;
    $html = $(`
      <div class="control" data-id="${model.id}">
        <ul class="text-muted">
          <li>
            <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
            Share
          </li>
          <li class="markAsComplete ${model.completed ? 'text-success' : ''}">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            Complete
          </li>
        </ul>
      </div>
   `);

    var parent = this;
    // mark as complete button
    $html.find('.markAsComplete').off('click').on('click', function() {
      var $this = $(this);
      util.post('/activity/complete/'+model.id, {complete: !model.completed},
        function(res) {
          $this.toggleClass('text-success');
          model.completed = !model.completed;
          var len = parent.subscribers.length;
          for (var ii = 0; ii < len; ++ii)
          {
            var ele = parent.subscribers[ii];
            if (ele.onActivityComplete) 
              ele.onActivityComplete(model);
          }
        }
      );
    });
    console.log(parent.subscribers);

    ControlTemplate.call(this, $html);

  };

  $.extend(ActivityActionControl.prototype, ControlTemplate.prototype);
  return ActivityActionControl;
});
