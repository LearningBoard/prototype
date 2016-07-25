define(['mdls/Activity'], function (Activity) {
  
  var Board = function(board)
  {
    $.extend(this, board);
    var actvs = board.activities;
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
      switch (this.status)
      {
        case 0: return "unpublished";
        case 1: return "published";
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
