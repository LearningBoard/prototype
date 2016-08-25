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

    err403: function()
    {
      location.href = "403.html"
    },

    toTitle: function(str)
    {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },

    strTrunc: function(str, length)
    {
      return (str.length > length) ? str.substr(0,length-1)+'&hellip;' : str
    },
    
    create: function(Cls, args) {
      args.unshift(Cls);
      console.log(args);
      var x = new (Function.prototype.bind.apply(Cls, args));
      console.log(x);
      return x;
    },

    /**
     * @param callback - function to be called
     * @param interval - callback will be called if the function is not called for [interval]
     */
    funcCalledWhenNotActive: function(callback, interval) {
      var id;

      function _wrapper() {
        // if _wrapper is called again in interval, previous callback in setTimeout will not be called, and the timeout will be refreshed
        clearTimeout(id);
        id = setTimeout(function(args) {
          callback.apply(null, args);
        }, interval, arguments);
      }
      return _wrapper;
    },
    
    saveRemindBeforeUnload: function(e) {

      // If we haven't been passed the event get the window.event
      e = e || window.event;

      var message = "Your board haven't been saved. \nDo you want to leave the page?";

      // For IE6-8 and Firefox prior to version 4
      if (e) 
      {
          e.returnValue = message;
      }

      // For Chrome, Safari, IE8+ and Opera 12+
      return message;
    },

    getAppRootUrl: function() {
      var loc = window.location.pathname;
      for(var i = 0; i < 1; i++) {
        loc = loc.substring(0, loc.lastIndexOf('/'));
      }
      return window.location.protocol + '//' + window.location.host + loc;
    },

    uuid: function() {
      // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    propertyExtend: function(dest) {
      for (var i = 1; i < arguments.length; ++i)
      {
        var src = arguments[i];
        for(var k in src) 
          dest[k] = src[k];
      }
    },

    toSecond: function(time) {
      console.log(time);
      var arr = time.split(":");
      console.log(arr);
      arr = arr.map(function(ele){return parseInt(ele);})
      var x = arr[0]*3600 + arr[1]*60 + arr[2];
      console.log(x);
      return x;
    }
  }
});
