define(['util', 'jquery_ui', 'temps/ListTemplate'], function(util, jquery_ui, ListTemplate) {
  "use strict";

  var noFileHtml = `
  <p class="text-center noElement" style="margin-top: 25px">
    <i>Please select your file(s)</i>
  </p>`;

  var GFileListTemplate = function(gFileTemps) {
    if (gFileTemps === undefined) var gFileTemps = [];

    this.model = util.arrayMapping(gFileTemps, function(ele){return ele.model});
    var $template = $(`
    <div class="listFrame">
      <div class="anchor file-trash"><span class="glyphicon glyphicon-trash file-trash-icon"></span></div>
      <div class="fileList"></div>
    </div>`);
    var templateList = gFileTemps.slice();

    ListTemplate.call(this, templateList, $template, $template.children(".fileList"));
    if (this.length === 0) this.$container.append(noFileHtml);

    for (var i = 0; i < this.length; ++i)
    {
      this.$container.append(templateList[i].$template);
    }

    var thisArg = this;
    $template.find(".file-trash").droppable({
      accept: ".fileDisplay",
      drop: function(event, ui) {
        ui.draggable.remove();
      },
      hoverClass: "file-trash-active"
    });

  }

  $.extend(GFileListTemplate.prototype, ListTemplate.prototype);

  /**
   * @override
   */
  GFileListTemplate.prototype.removeElementBy = function(filter, settings) 
  {
    ListTemplate.prototype.removeElementBy.call(this, filter, settings);
    if (this.templateList.length < 1) this.$container.append(noActHtml);
  }

  /**
   * @override
   */
  GFileListTemplate.prototype.removeElementAt = function(index, settings) 
  {
    ListTemplate.prototype.removeElementAt.call(this, index, settings);
    if (this.templateList.length < 1) this.$container.append(noFileHtml);
  }

  return GFileListTemplate;

});