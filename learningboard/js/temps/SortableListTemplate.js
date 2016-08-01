define(["jquery_ui", "util"], function(ui, util) {

  var SortableListTemplate = function(listTemplate, order_url)
  {
    $.extend(this, listTemplate);
    $.extend(this, listTemplate.__proto__);

    this.sortingEnabled = true;
    this.order_url = order_url;

    var $container = this.$container;
    var $template = this.$template;
    var templateList = this.templateList;

    $container.sortable({
      cancel: '.noElement',
      opacity: 0.95,
      cursor: 'move'
    });
    console.log($container);
    $container.addClass("sortableList");
    var startIndex = -1, endIndex = -1;
    $template.on('sortstart', function(e, ui)
    {
      startIndex = ui.item.index();
    });
    $template.on('sortupdate', function(e, ui)
    {
      var target = templateList[startIndex];
      endIndex = ui.item.index();
      for (var i = startIndex; i > endIndex; --i)
      {
        // startIndex > endIndex
        templateList[i] = templateList[i-1];
        templateList[i].updateIndex(i);
      }
      for (var i = startIndex; i < endIndex; ++i)
      {
        // endIndex > startIndex
        templateList[i] = templateList[i+1];
        templateList[i].updateIndex(i);
      }
      templateList[endIndex] = target;
      target.updateIndex(endIndex);
      this.saveOrder();
    });
  }

  SortableListTemplate.prototype.saveOrder = function()
  {
    var order = {};
    for (var i = 0; i < templateList.length; ++i)
    {
      order[templateList[i].model.id] = i;
    }
    util.post(order_url, order);
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
