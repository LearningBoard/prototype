define(['util', 'temps/ListTemplate'], function(util, ListTemplate) {

  var noFileHtml = `
  <p class="text-center noElement">
    <i>Please select your files</i>
  </p>`;

  var GFileListTemplate = function(gFileTemps) {
    if (gFileTemps === undefined) gFileTemps = [];

    this.model = util.arrayMapping(gFileTemps, function(ele){return ele.model});
    var $template = $(`
    <div class="listFrame">
      <div class="fileList"></div>
    </div>`);
    var templateList = gFileTemps.slice();

    ListTemplate.call(this, templateList, $template, $template.children(".fileList"));
    if (this.length === 0) this.$container.append(noFileHtml);

    for (var i = 0; i < length; ++i)
    {
      this.$container.append(templateList[i].$template);
    }
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
    if (this.templateList.length < 1) this.$container.append(noActHtml);
  }

  return GFileListTemplate;

});