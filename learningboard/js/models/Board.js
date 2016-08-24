define(['util', 'mdls/Activity'], function (util, Activity) {
  "use strict";

  var Board = function(board)
  {
    $.extend(this, board);
    var actvs = [];
    if (board.activities) {
      board.activities.reduce(function(array, item) {
        if (item.publish) {
          actvs.push(new Activity(item));
        }
        return array;
      }, actvs);
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
      if (this.activities.length < 1) return 0;
      var count = this.activities.reduce(function(count, current) {
        if (current.completed) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
      return parseInt(count / this.activities.length * 100);
    },

    getTotalUnpublishActivityNum: function()
    {
      return this.model.activity_num_all - this.model.activity_num;
    },

    published: function()
    {
      return this.publish === true;
    },

    getOwnerName: function()
    {
      return this.author.username;
    }

  });

  return Board;

})
