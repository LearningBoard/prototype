define(['util', 'jquery_ui', 'temps/ListTemplate'], function(util, jquery_ui, ListTemplate) {
  "use strict";

  var noFileHTML = `
  <p class="text-center noElement" style="margin-top: 25px">
    <i>Please select your file(s)</i>
  </p>`;

  var FileListTemplate = function(fileTemps, $template, $inner_container, noElementHTML) {
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

    if (noElementHTML === undefined) noElementHTML = noFileHTML;

    ListTemplate.call(this, 
    {
      templateList: templateList, 
      template: $template, 
      container: $inner_container,
      noELementHTML: noElementHTML
    });

    this.model = templateList.map(function(ele){return ele.model});

    if (this.length === 0) this.$container.append(noFileHTML);

    for (var i = 0; i < this.length; ++i)
    {
      templateList[i].display(this.$container);
    }
  }

  $.extend(FileListTemplate.prototype, ListTemplate.prototype);

  return FileListTemplate;

});