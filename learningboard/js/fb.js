define(['facebook'], function() {
  FB.init({
    appId   : '1677882592535443',
    version : 'v2.4',
  });
  FB.getLoginStatus(function(response) {
    console.log(response);
  });
});