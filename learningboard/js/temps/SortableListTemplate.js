define(["jquery_ui", "util"], function(ui, util) {

  var SortableListTemplate = function(listTemplate)
  {
    $.extend(this, listTemplate);
    $.extend(this, listTemplate.__proto__);

    var $template = this.$template;
    var _templateList = this._templateList;
    var $container = this.$_container;

    $template.prepend(`
      <p class="text-right">
        <button type="button" class="btn btn-default btn-sm sortLockMode">Sorting Enabled</button>
      </p>`
    );
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
      var order = {};
      for (var i = 0; i < _templateList.length; ++i)
      {
        order[_templateList[i].model.id] = i;
      }
      console.log(order);
      util.post('/lb/activityorder/', order);
    });

    var enabled = true;
    $template.find(".sortLockMode").on("click", function()
    {
      if (enabled)
      {
        $container.sortable("disable");
        $(this).text("Sorting Disabled");
        enabled = false;
      }
      else
      {
        enabled = true;
        $container.sortable("enable");
        $(this).text("Sorting Enabled");
      }
    });
    if (listTemplate.empty())
    {
      $template.find(".sortLockMode").addClass("hidden");
    }
  }

  return SortableListTemplate;

});
