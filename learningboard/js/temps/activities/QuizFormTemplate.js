define(['../ActivityFormTemplate'], function(ActivityFormTemplate){
  'use strict';

  var QuizFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Quiz', 'quiz');

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Quiz Link</label>
      <input type="text" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="Quiz link (support Qzzr)" pattern=".*(qzzr.com).*" required>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(QuizFormTemplate.prototype, ActivityFormTemplate.prototype);
  return QuizFormTemplate;
});
