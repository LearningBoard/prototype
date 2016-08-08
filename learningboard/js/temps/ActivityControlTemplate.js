define(['util', 'temps/Template'], function (util, Template) {

  var ActivityControlTemplate = function(model, editMode, BoardDetailTemplate) {

    var $this = this;
    var boardModel = BoardDetailTemplate ? BoardDetailTemplate.model : null;
    var $html;
    if (editMode) {
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
    } else {
      $html = $(`
        <div class="control" data-id="${model.id}">
          <ul class="text-muted">
            <li>
              <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
              Share
            </li>
            <li class="markAsComplete ${model.completed ? 'text-success' : ''}">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
              Mark as complete
            </li>
            <li>
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              Delete
            </li>
          </ul>
        </div>
     `);
    }

    // mark as complete button
    $html.find('.markAsComplete').off('click').on('click', function() {
      var $this = $(this);
      util.post('/activity/complete/'+model.id, {complete: !model.completed},
        function(res) {
          $this.toggleClass('text-success');
          model.completed = !model.completed;
          var progrssElement = BoardDetailTemplate.$template.find('.progressBox .progress-bar');
          var percentagePerActivity = !boardModel.activity_num ? 0 : Math.ceil(100 / boardModel.activity_num);
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
      );
    });

    Template.call(this, $html);
  };

  $.extend(ActivityControlTemplate.prototype, Template.prototype);
  return ActivityControlTemplate;
});
