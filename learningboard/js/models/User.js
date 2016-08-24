define(function() {
  return {
    setUser: function(user)
    {
      localStorage.user = JSON.stringify(user)
    },

    set: function(key, val)
    {
      var user = JSON.parse(localStorage.user);
      user[key] = val;
      localStorage.user = JSON.stringify(user)
    },

    getId: function()
    {
      try
      {
        return JSON.parse(localStorage.user).id;
      }
      catch(e)
      {
        return false;
      }
    },

    getInfo: function()
    {
      try
      {
        return JSON.parse(localStorage.user);
      }
      catch(e)
      {
        return {};
      }
    },

    setToken: function(token)
    {
      localStorage.token = token;
    },

    getToken: function()
    {
      return "Bearer " + localStorage.token;
    },

    hasToken: function()
    {
      return localStorage.token? true: false;
    }, 

    is_staff: function()
    {
      try
      {
        var user = JSON.parse(localStorage.user);
      }
      catch(e)
      {
        return false;
      }
      if (user.roles)
      {
        var length = user.roles.length;
        var roles = user.roles;
        for (var i = 0; i < length; ++i)
          if (roles[i].name === "admin") return true;
      }
      return false;
    },

    clear: function() 
    {
      localStorage.user = "{}";
      localStorage.token = '';
    }
  }
});