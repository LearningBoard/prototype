define(["temp/ListTemplate"], function() {
  "use strict";

  var BoardBriefListTemplate = function(temps) {
    ListTemplate.call(this, 
    {
      templateList: temps, 
      noElementHTML: "Could not find any Learning Boards. Create your own one today."
    });

  }

  $.extend(BoardBriefListTemplate.prototype, ListTemplate.prototype);

  return BoardBriefListTemplate;
});