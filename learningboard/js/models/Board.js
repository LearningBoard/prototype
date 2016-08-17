define(['util', 'mdls/Activity'], function (util, Activity) {
  "use strict";

  var Board = function(board)
  {
    $.extend(this, board);
    var actvs;
    if (board.activities)
      actvs = board.activities;
    else actvs = [];
    var len = actvs.length;
    for (var i = 0; i < len; ++i)
    {
      actvs[i] = new Activity(actvs[i]);
    }
  };
  // Board Mixin, for different templates of learning boards
  // extend this Prototype everytime you create a new view for the object

  $.extend(Board.prototype, {

    getLevelName: function()
    {
        switch (this.level)
        {
            case 0: return "beginner";
            case 1: return "intermediate";
            case 2: return "advanced";
        };
    },

    getStatusName: function()
    {
      switch (this.publish)
      {
        case false: return "not published";
        case true: return "published";
      };
    },

    getCoverImage: function()
    {
      if (!this.coverImage) {
        return 'img/placeholder-no-image.png';
      }
      return util.urls.media_addr + '/' + this.coverImage;
    },

    getCompletedPercentage: function()
    {
      var count;
      var count = this.activities.map(function(item) {
        return item.completed;
      }).reduce(function(prev, current) {
        if (current) {
          return prev + 1;
        } else {
          return prev;
        }
      }, 0);
      return parseInt(count / this.activities.length * 100);
    },

    published: function()
    {
      console.log(this);
      return this.publish === true;
    },

    getOwnerName: function()
    {
      console.log(this.author);
      return this.author.username;
    }

  });

  return Board;

})
