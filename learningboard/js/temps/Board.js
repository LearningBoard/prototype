define(function () {
  
  var Board = function(board)
  {
    this.board = board;
  };
  // Board Mixin, for different templates of learning boards
  // extend this Prototype everytime you create a new view for the object

  $.extend(Board.prototype, {

    getLevelName: function()
    {
        switch (this.board.level)
        {
            case 0: return "beginner";
            case 1: return "intermediate";
            case 2: return "advanced";
        };
    },

    getStatusName: function()
    {
      switch (this.board.status)
      {
        case 0: return "unpublished";
        case 1: return "published";
      };
    },

    published: function()
    {
      return this.board.status === 1;
    }

  });

  return Board;

})
