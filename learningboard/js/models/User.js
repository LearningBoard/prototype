define(function() {
  return {
    set: function(user)
    {
      localStorage.user = JSON.stringify(user)
    },

    getId: function()
    {
      return JSON.parse(localStorage.user).id;
    },

    getInfo: function()
    {
      return JSON.parse(localStorage.user);
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
      return true;
    }
  }
});