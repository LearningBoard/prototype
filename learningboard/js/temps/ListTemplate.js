
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

