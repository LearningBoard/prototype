define(['util', 'jquery_ui', 'temps/ListTemplate'], function(util, jquery_ui, ListTemplate) {
  "use strict";

  var noFileHtml = `
  <p class="text-center noElement" style="margin-top: 25px">
    <i>Please select your file(s)</i>
  </p>`;

  var FileListTemplate = function(fileTemps, $template, $inner_container, noElementHtml) {
    if (fileTemps === undefined) var fileTemps = [];
    var templateList = fileTemps.slice();

    if ($template === undefined)
    {
      $template = $(`
      <div class="listFrame">
        <div class="anchor file-trash"><span class="glyphicon glyphicon-trash file-trash-icon"></span></div>
        <div class="fileList"></div>
      </div>`);
      $template.find(".file-trash").droppable({
        accept: ".fileDisplay",
        drop: function(event, ui) {
          ui.draggable.remove();
        },
        hoverClass: "file-trash-active"
      });
      $inner_container  = $template.children(".fileList");
    }

    if (noElementHtml === undefined) noElementHtml = noFileHtml;

    ListTemplate.call(this, templateList, $template, $inner_container, noElementHtml);

    this.model = templateList.map(function(ele){return ele.model});

    if (this.length === 0) this.$container.append(noFileHtml);

    for (var i = 0; i < this.length; ++i)
    {
      templateList[i].display(this.$container);
    }
  }

  $.extend(FileListTemplate.prototype, ListTemplate.prototype);

  return FileListTemplate;

});