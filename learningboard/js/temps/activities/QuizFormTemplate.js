define(['../ActivityFormTemplate'], function(ActivityFormTemplate){
  'use strict';

  var QuizFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Quiz', 'quiz');

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Quiz Link</label>
      <input type="text" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="Quiz link (support Qzzr and ClassMarker)" pattern=".*(qzzr.com|classmarker.com).*" required>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(QuizFormTemplate.prototype, ActivityFormTemplate.prototype);

  /**
   * @override
   */
  QuizFormTemplate.prototype.serializeObject = function()
  {
    var obj = ActivityFormTemplate.prototype.serializeObject.call(this);
    var link = obj.quiz_link;
    if (link.match(/qzzr\.com/) !== null)
    {
      obj.quiz_platform = "qzzr";
      obj.quiz_id = link.match(/qzzr\.com\/c\/quiz\/(\d+)/)[1];
    }
    else if (link.match(/classmarker\.com/) !== null)
    {
      obj.quiz_platform = "clsmrkr";
      obj.quiz_id = link.match(/\/start\/\?quiz=(\w*)/)[1];
      console.log(obj.quiz_id);
    }
    obj[this.type+"_link"] = undefined;
    return obj;
  }

  return QuizFormTemplate;
});
