define(['../ActivityFormTemplate'], function(ActivityFormTemplate){
  'use strict';

  var CodeFormTemplate = function() {
    ActivityFormTemplate.call(this, 'Code', 'code');

    var customFormHtml = `
    <div class="form-group">
      <label for="${this.type}_link">Code Link<span class="text-danger">*</span></label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="code link (support JSFiddle, Plunker, CodePen, repl.it)" pattern=".*(jsfiddle.net|plnkr.co|codepen.io|repl.it).*" required>
    </div>`;
    this.$template.find('.customForm').append(customFormHtml);
  };

  $.extend(CodeFormTemplate.prototype, ActivityFormTemplate.prototype);
  return CodeFormTemplate;
});
