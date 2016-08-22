define(['util', "temps/ControlTemplate"], function (util, ControlTemplate) {

  var ActivityEditControl = function(actTemp) {

    var $html;
    this.model = actTemp.model;
    $html = $(`
      <div class="control" data-id="${this.model.id}">
        <ul>
          <li ${this.model.published() ? '' : 'class="hidden"'}>
            <span class="glyphicon glyphicon-floppy-remove publishBtn" data-publish="false" aria-hidden="true"></span>
          </li>
          <li ${this.model.published() ? 'class="hidden"' : ''}>
            <span class="glyphicon glyphicon-floppy-saved publishBtn" data-publish="true" aria-hidden="true"></span>
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
  }

  $.extend(ActivityEditControl.prototype, ControlTemplate.prototype);

  ActivityEditControl.prototype.onActive = function() {
    var thisArg = this;

    // publish activity
    this.$template.find('.publishBtn').on('click', function(e) {
      var publish = $(this).data('publish');
      util.post('/activity/publish/'+thisArg.model.id, {publish: publish},
        function(data)
        {
          thisArg.model.publish = publish;
          thisArg.$template.find('.publishBtn').parent('li').addClass('hidden');
          thisArg.$template.find('.publishBtn[data-publish="'+!publish+'"]').parent('li').removeClass('hidden');
          var len = thisArg.subscribers.length, ele;
          for (var ii = 0; ii < len; ++ii)
          {
            ele = thisArg.subscribers[ii];
            if (ele.onActivityPublish) ele.onActivityPublish(thisArg.model);
          }
        }
      );
    });

    // remove activity
    this.$template.find("[name='removeBtn']").on('click', function(e){
      var r = confirm('Are you sure to delete this activity?');
      if(!r) return;
      util.delete('/activity/'+thisArg.model.id+'/',
        function(data)
        {
          var len = thisArg.subscribers.length, ele;
          for (var ii = 0; ii < len; ++ii)
          {
            ele = thisArg.subscribers[ii];
            if (ele.onActivityDelete) ele.onActivityDelete(thisArg.model);
          }
        }
      );
    });
  }

  return ActivityEditControl;
});
