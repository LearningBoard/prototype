define(['util', "temps/ControlTemplate"], function (util, ControlTemplate) {

  var ActivityEditControl = function(actTemp) {

    console.log(arguments);

    var $html;
    var model = actTemp.model;
    $html = $(`
      <div class="control" data-id="${model.id}">
        <ul>
          <li ${model.published() ? 'class="hidden"' : ''}>
            <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
          </li>
          <li ${model.published() ? '' : 'class="hidden"'}>
            <span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span>
          </li>
          <li>
            <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
          </li>
          <li>
            <span class="glyphicon glyphicon-remove" name="removeBtn" aria-hidden="true"></span>
          </li>
        </ul>
      </div>
   `);

    ControlTemplate.call(this, $html);

    var thisArg = this;
    // remove activity
    $html.find("[name='removeBtn']").on('click', function(e){
      var r = confirm('Are you sure to delete this activity?');
      if(!r) return;
      util.delete('/activity/'+model.id+'/',
        function(data)
        {
          var len = thisArg.subscribers.length, ele;
          console.log(thisArg.subscribers);
          for (var ii = 0; ii < len; ++ii)
          {
            ele = thisArg.subscribers[ii];
            if (ele.onActivityDelete) ele.onActivityDelete(model);
          }
        }
      );
    });
  }

  $.extend(ActivityEditControl.prototype, ControlTemplate.prototype);

  return ActivityEditControl;
});
