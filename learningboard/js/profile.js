define(['util', 'mdls/User', 'temps/BoardBriefListTemplate', 'temps/BoardBriefTemplate', 'temps/ProfileSubscribeTemplate', 'temps/ProfileRecentActivityTemplate', 'temps/ProfileRecentActivityListTemplate'], function(util, User, BoardBriefListTemplate, BoardBriefTemplate, ProfileSubscribeTemplate, ProfileRecentActivityTemplate, ProfileRecentActivityListTemplate) {
  $(function() {
    if (location.search.endsWith(User.getId()) && !User.hasToken()) {
      alert('This feature requires login');
      location.href = 'login.html';
      return;
    } else if (!/\?\d+/.test(location.search)) {
      alert('User not found');
      location.href = 'index.html';
      return;
    }

    var off = $(".fixed-sidebar-right").offset().top;
    $(".fixed-wrap-inner").css("max-width", $(".fixed-sidebar-right").width());
    $(window).resize(function() {
      off = $(".fixed-sidebar-right").offset().top;
      $(".fixed-wrap-inner").css("max-width", $(".fixed-sidebar-right").width());
    });
    $(window).scroll(function() {
      var scroPos = $(window).scrollTop();
      if (scroPos >= off-78) $(".fixed-sidebar-right").addClass("fixed");
      else $(".fixed-sidebar-right").removeClass("fixed");
    });

    var userId = location.search.match(/\?(\d+)/)[1];
    var queryBoardUrl = User.getId() == userId ? '/lb?user' : '/lb?user=' + userId;
    util.get(queryBoardUrl,
      function(res)
      {
        var board_list = res.data.lb;
        if (board_list.length) {
          board_list = board_list.map(function(item, i) {
            return new BoardBriefTemplate(item, i);
          });
          board_list = new BoardBriefListTemplate(board_list);
          board_list.display($('#boardList'));
        } else {
          board_list = new BoardBriefListTemplate();
          board_list.display($("#boardList"));
        }
      }
    );
    var displayUserInfo = function(data) {
      if (data.passports) {
        var key;
        data.passports.some(function(item) {
          if (data.info[item.provider]) {
            key = item.provider;
            return true;
          }
        });
        if (key) {
          switch (key) {
            case 'facebook':
              $('#user_name').text(data.info[key].name || '');
              $('#user_location').text(data.info[key].location ? data.info[key].location.name : '');
              var school;
              if (data.info[key].education) {
                var len = data.info[key].education.length;
                for (var ii = 0; ii < len; ++ii)
                {
                  ele = data.info[key].education[ii];
                  if (ele.type === 'College')
                    school = ele.school.name;
                }
              }
              $('#user_education').text(school || '');
              $('.profile-avatar').attr('src', `https://graph.facebook.com/${data.info[key].id}/picture?height=263&height=263`);
              break;
          }
        } else {
          $('#user_name').text(data.username);
        }
      }
    };

    util.get('/user/' + userId,
      function(res) {
        var data = res.data.user;
        displayUserInfo(data);
        if (data.subscribedlb.length < 1) {
          $("div.subscribinglb").append(`
            <div class="col-sm-12 thumbnail sidebar-item opaque-75">
              <i>Hasn't subscribed any board</i>
            </div>
          `);
        } else {
          data.subscribedlb.map(function(item) {
            var temp = new ProfileSubscribeTemplate(item);
            temp.display($('div.subscribinglb'));
          });
        }
        var actList;
        if (data.recentActivity && data.recentActivity.length > 0) {
          var userObj = {id: data.id, username: data.username, email: data.email, info: data.info};
          actList = data.recentActivity.map(function(item, i) {
            return new ProfileRecentActivityTemplate(Object.assign({}, item, {user: userObj}), i);
          });
          actList = new ProfileRecentActivityListTemplate(actList);
          actList.display($('#recentActivity'));
        } else {
          actList = new ProfileRecentActivityListTemplate();
          actList.display($('#recentActivity'));
        }
      },
      function() {
        alert('User not found');
        location.href = 'index.html';
        return;
      }
    );
  });
});
