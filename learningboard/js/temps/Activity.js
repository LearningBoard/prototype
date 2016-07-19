var Activity = function(activity)
{
  this.activity = activity;
};

Activity.prototype = {
  published: function()
  {
    return this.activity.status === 1;
  }
};

