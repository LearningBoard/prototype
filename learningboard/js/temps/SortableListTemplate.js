define(["jquery_ui", "util"], function(ui, util) {

  var SortableListTemplate = function(listTemplate, order_url)
  {
    $.extend(this, listTemplate);
    $.extend(this, listTemplate.__proto__);

    this.sortingEnabled = true;
    this.order_url = order_url;

    console.log(this);
    var $container = this.$_container;
    var $template = this.$template;
    var _templateList = this._templateList;

    $container.sortable({
      cancel: '.noElement',
      opacity: 0.95,
      cursor: 'move'
    });
    $container.addClass("sortableList");
    var startIndex = -1, endIndex = -1;
    $template.on('sortstart', function(e, ui)
    {
      startIndex = ui.item.index();
    });
    $template.on('sortupdate', function(e, ui)
    {
      var target = _templateList[startIndex];
      endIndex = ui.item.index();
      for (var i = startIndex; i > endIndex; --i)
      {
        // startIndex > endIndex
        _templateList[i] = _templateList[i-1];
        _templateList[i].updateIndex(i);
      }
      for (var i = startIndex; i < endIndex; ++i)
      {
        // endIndex > startIndex
        _templateList[i] = _templateList[i+1];
        _templateList[i].updateIndex(i);
      }
      _templateList[endIndex] = target;
      target.updateIndex(endIndex);
      this.saveOrder();
    });
  }

  SortableListTemplate.prototype.saveOrder = function()
  {
    var order = {};
    for (var i = 0; i < _templateList.length; ++i)
    {
      order[_templateList[i].model.id] = i;
    }
    console.log(order);
    util.post(order_url, order);
  }

  SortableListTemplate.prototype.setSortingEnabled = function(enabled)
  {
    this.sortingEnabled = enabled;
    if (this.sortingEnabled)
    {
      this.$_container.sortable("enable");
    }
    else
    {
      this.$_container.sortable("disable");
    }
  }

  SortableListTemplate.prototype.toggleSortingEnabled = function()
  {
    this.setSortingEnabled(!this.sortingEnabled);
  }

  return SortableListTemplate;

});
