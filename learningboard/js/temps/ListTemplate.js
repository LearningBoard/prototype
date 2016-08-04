define(function() {
  var ListTemplate = function(templateList, $template, $inner_container)
  {
    this.templateList = templateList;
    // a list of Template objects

    this.$container = ($inner_container === undefined? $template: $inner_container);
    // a jQuery html element which contains all children templates

    this.$template = $template;
    this.length = templateList.length;
  };

  ListTemplate.prototype.display = function()
  {
    var outer_containers = arguments;
    if(this.templateList.length > 0)
    {
      this.$container.empty();
      for (var i = 0; i < this.templateList.length; ++i)
      {
        this.templateList[i].display(this.$container);
      }
    }
    for (var i = 0; i < arguments.length; ++i)
    {
      outer_containers[i].append(this.$template);
    }
  };

  ListTemplate.prototype.remove = function()
  {
    this.$template.remove();
  }

  ListTemplate.prototype.isEmpty = function()
  {
    return this.length === 0;
  }

  ListTemplate.prototype.empty = function() 
  {
    while (this.length) this.removeElementAt(0);
  }

  ListTemplate.prototype.addElement = function(ele)
  {
    this.model.push(ele.model);
    this.templateList.push(ele);
    this.length++;

    if (this.length === 1)
    {
      this.$container.children(".noElement").remove();
    }
    ele.display(this.$container);
    console.log("pushing");
    console.log(this.getIdList());
  }

  ListTemplate.prototype.updateElementAt = function(model, index)
  {
    this.model[index] = model;

    this.templateList[index].update(model);
  }

  ListTemplate.prototype.removeElementAt = function(index, settings)
  {
    if (settings === undefined) settings = {};
    if (this.templateList[index] !== undefined)
    {
      var $tmp = this.templateList[index].$template;
      if (settings.fadeOut)
      {
        $tmp.fadeOut('slow', function(){
          $tmp.remove();
        });
      }
      else {
        $tmp.remove();
      }
    }

    this.templateList.splice(index, 1);
    this.model.splice(index, 1);

    this.length--;
    for (var ii = index; ii < this.length; ++ii)
      this.templateList[ii].updateIndex(ii);
    console.log("removing");
    console.log(this.getIdList());
  }

  function match(obj, condition)
  {
    for (var op in condition)
    {
      if (obj[op] !== condition[op]) return false;
    }
    return true;
  }

  ListTemplate.prototype.removeElementBy = function(filter, settings)
  {
    if (filter === undefined || $.isEmptyObject(filter)) return;
    for (var ii = 0; ii < this.length; ++ii)
    {
      if (match(this.model[ii], filter))
      {
        ListTemplate.prototype.removeElementAt.call(this, ii, settings);
      }
    }
  }

  ListTemplate.prototype.getIdList = function() 
  {
    return this.templateList.map(function(ele) {return ele.model.id});
  }

  return ListTemplate;

  /**
   * @param {(function|Object)} filter - condition(s) of the wanted element
   * @param {int} num - number of the occurence of the wanted element
   */
  ListTemplate.prototype.indexOf = function(filter, num)
  {
    var length = model.length;
    if (typeof(filter) === "function")
    {
      for (var ii = 0; ii < length; ii++)
      {
        if (filter(model[ii]) && --num) return ii;
      }
      return -1;
    }

    else 
    {
      for (var ii = 0; ii < length; ii++)
      {
        for (var key in filter)
        {
          if (this.model[ii][key] === filter[key] && --num)
            return ii;
        }
      }      
    }
  }
  
});
