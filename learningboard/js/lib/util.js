define(function() {
  return {
    arrayMapping: function(list, mapping_func) 
    {
      // iterate a list and return a mapping of the array
      // mapping_func(element, index)
      var arr = [];
      for (var i = 0; i < list.length; ++i)
      {
        arr.push(mapping_func(list[i], i));
      }
      return arr; 
    }
  };
});
