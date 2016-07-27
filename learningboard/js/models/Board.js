define(['mdls/Activity'], function (Activity) {
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
        case false: return "unpublished";
        case true: return "published";
      };
    },

    published: function()
    {
      console.log(this);
      return this.status === 1;
    }

  });

  return Board;

})
