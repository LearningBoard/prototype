define(['util', 'temps/ListElementTemplate'], function(util, ListElementTemplate) {
  'use strict';

  var ProfileRecentActivityTemplate = function(activity, index) {

    var getAction = function(activity) {
      if (activity.body.subscribe) return 'subscribed';
      if (activity.body.like) return 'liked';
      if (activity.body.complete) return 'completed';
      if (activity.body.publish) return 'published';
      switch(activity.action) {
        case 'create':
          return 'added';
        case 'update':
          return 'updated';
        default:
          return activity.action;
      }
    };

    var string = '', coverImage, action = getAction(activity);
    switch(activity.model) {
      case 'learningboard':
        string += `${action} <a href="board_view.html?${activity.body.lb.id}"><i>${activity.body.lb.title}</i></a>`;
        break;
        coverImage = activity.body.lb.coverImage || '';
      case 'activity':
        if (action === 'liked' || action === 'completed') {
          string += `${action} activity <i>${activity.body.activity.title}</i> in`;
          string += ` <a href="board_view.html?${activity.body.activity.lb.id}"><i>${activity.body.activity.lb.title}</i></a>`;
          coverImage = activity.body.activity.lb.coverImage || '';
        } else {
          string += `${action} activity <i>${activity.body.title}</i> in`;
          string += ` <a href="board_view.html?${activity.body.lb.id}"><i>${activity.body.lb.title}</i></a>`;
          coverImage = activity.body.lb.coverImage || '';
        }
        break;
      case 'comment':
        string += `${action} a comment to activity <i>${activity.body.activity.title}</i> in`;
        string += ` <a href="board_view.html?${activity.body.activity.lb.id}">${activity.body.activity.lb.title}</a>`;
        coverImage = activity.body.activity.lb.coverImage || '';
        break;
      default:
        string = 'used the platform';
        coverImage = '';
    }

    var $html = $(`
      <div class="row thumbnail sidebar-item">
        <div class="col-sm-7" style="padding: 5px">
          <p style="font-size: 14px">
            <a href="profile.html?${activity.user.id}">${activity.user.username}</a> ${string}
          </p>
          <p class="minor">Time: ${new Date(activity.createdAt).toDateString()}</p>
        </div>
        <div class="col-sm-5 no-padding-right" style="padding-left: 0px">
          <div class="img-button thumbnail" style="margin-bottom: 0px">
            <img class="img-responsive" src="${coverImage ? util.urls.media_addr + '/' + coverImage : 'img/placeholder-no-image.png'}"/>
          </div>
        </div>
      </div>
    `);

    ListElementTemplate.call(this, $html, index);
  };

  $.extend(ProfileRecentActivityTemplate.prototype, ListElementTemplate.prototype);
  return ProfileRecentActivityTemplate;
});
