define(function() {
  var ListTemplate = function(templateList, $template, $inner_container)
  {
    this._templateList = templateList;
    // a list of Template objects

    this.$_container = ($inner_container === undefined? $template: $inner_container);
    // a jQuery html element which contains all children templates

    this.$template = $template;
    console.log(this.$template);
  };

  ListTemplate.prototype.display = function()
  {
    var outer_containers = arguments;
    if(this._templateList.length > 0)
    {
      this.$_container.empty();
      for (var i = 0; i < this._templateList.length; ++i)
      {
        this._templateList[i].display(this.$_container);
      }
    }
    for (var i = 0; i < arguments.length; ++i)
    {
      outer_containers[i].append(this.$template);
    }
  };

  ListTemplate.prototype.empty = function()
  {
    return this._templateList.length === 0;
  }

  ListTemplate.prototype.addElement = function(ele)
  {
    var index = this._templateList.length;
    this._templateList.push(ele);
    ele.display(this.$_container);
  }

  return ListTemplate;
  
});
