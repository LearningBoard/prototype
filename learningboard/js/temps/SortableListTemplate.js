define(["jquery_ui", "util"], function(jquery_ui, util) {

  var SortableListTemplate = function(listTemplate, initialSortingEnabled)
  {
    $.extend(this, listTemplate);
    $.extend(this, listTemplate.__proto__);

    this.sortingEnabled = initialSortingEnabled === undefined? true: initialSortingEnabled;

    var $container = this.$container;
    var $template = this.$template;
    var templateList = this.templateList;
    var model = this.model;

    $container.sortable({
      cancel: '.noElement, .anchor',
      opacity: 0.95,
      cursor: 'move'
    });
    this.setSortingEnabled(this.sortingEnabled);
    $container.addClass("sortableList");
    var startIndex = -1, endIndex = -1;
    $template.on('sortstart', function(e, ui)
    {
      startIndex = ui.item.index();
    });

    var thisArg = this;
    $template.on('sortupdate', function(e, ui)
    {
      var target = templateList[startIndex];
      endIndex = ui.item.index();
      if (endIndex === -1)
      {
          // the target is removed
        thisArg.removeElementAt(startIndex);
        return;
      }
      for (var ii = startIndex; ii > endIndex; --ii)
      {
        // startIndex > endIndex
        templateList[ii] = templateList[ii-1];
        model[ii] = model[ii-1];
        templateList[ii].updateIndex(ii);
      }
      for (var ii = startIndex; ii < endIndex; ++ii)
      {
        // endIndex > startIndex
        templateList[ii] = templateList[ii+1];
        model[ii] = model[ii+1]
        templateList[ii].updateIndex(ii);
      }
      templateList[endIndex] = target;
      model[ii] = target.model;
      target.updateIndex(endIndex);
    });
  }

  SortableListTemplate.prototype.setSortingEnabled = function(enabled)
  {
    this.sortingEnabled = enabled;
    if (this.sortingEnabled)
    {
      this.$container.sortable("enable");
    }
    else
    {
      this.$container.sortable("disable");
    }
  }

  SortableListTemplate.prototype.toggleSortingEnabled = function()
  {
    this.setSortingEnabled(!this.sortingEnabled);
  }

  return SortableListTemplate;

});
