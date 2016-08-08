define(['mdls/User'], function(user) {
  "use strict";

  var icon_cdn = "http://cdn.webiconset.com/file-type-icons/images/icons/";

  var file_exts = ['aac', 'ai', 'aiff', 'asp', 'avi', 'bmp', 'c', 'cpp', 'css',
  'dat', 'dmg', 'doc', 'docx', 'dot', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv',
  'gif', 'h', 'html', 'ics', 'iso', 'java', 'jpg', 'jpeg', 'key', 'm4v', 'mid', 'mov',
  'mp3', 'mp4', 'mpg', 'odp', 'ods', 'odt', 'otp', 'ots', 'ott', 'pdf', 'php',
  'png', 'pps', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sql', 'tga',
  'tgz', 'tiff', 'txt', 'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip'];

  file_exts.contain = function(ext) {return file_exts.indexOf(ext) > -1; }

  file_exts.getURL = function(ext) 
  {
    var filename;
    if (this.contain(ext)) 
    {
      if (ext === "jpeg") filename = "jpg"; 
      else filename = ext;
    }
    else filename = "blank"; 
    return icon_cdn + filename + ".png";
  }

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

    var settings = {
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
      media_addr: serv_addr + '/media'
    },

    file_exts: file_exts,

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

    strTrunc: function(str, length)
    {
      return (str.length > length) ? str.substr(0,length-1)+'&hellip;' : str
    }
    
  }
});
