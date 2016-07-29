define(['mdls/User'], function(user) {

  var serv_addr = "http://localhost:1337";
  
  var default_error_func = function(res) {
    console.log(res);
  }

  function ajax(type, args)
  {
    var url = args[0];
    if (typeof args[1] === "function") 
    {
      var dataObject = {},
          success_func = args[1],
          error_func = args[2];
    }
    else 
    {
      var dataObject = args[1],
          success_func = args[2],
          error_func = args[3];
    }

    if (error_func === undefined)
      error_func = default_error_func;
     
    var token;
    if (user.hasToken())
      token = user.getToken();

    settings = {
      url: serv_addr+url, 
      data: dataObject, 
      dataType: "json",
      contentType: "application/json",
      type: type,
      success: success_func,
      error: error_func
    };

    if (type.toUpperCase() !== "GET")
      settings.data = JSON.stringify(settings.data);

    if (token !== undefined)
     settings.headers = {"Authorization": token};

    return $.ajax(settings);
  }


  return {

    urls: {
      serv_addr: serv_addr,
      actOrder: "/lb/activityorder/"
    },

    serv_addr: serv_addr,
    media_addr: serv_addr + '/media',

    arrayMapping: function(list, mapping_func) 
    {
      // iterate a list and return a mapping of the array
      // mapping_func(ele, idx)
      var arr = [];
      for (var i = 0; i < list.length; ++i)
      {
        arr.push(mapping_func(list[i], i));
      }
      return arr; 
    },

    post: function()
    {
      return ajax('POST', arguments);
    },

    get: function()
    {
      return ajax('GET', arguments);
    },

    put: function()
    {
      return ajax('PUT', arguments);
    },

    delete: function()
    {
      return ajax('DELETE', arguments);
    },

    err404: function()
    {
      location.href = "404.html"
    },

    toTitle: function(str)
    {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },
    
  }
});
