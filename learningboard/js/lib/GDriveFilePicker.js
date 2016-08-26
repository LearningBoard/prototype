define(["https://apis.google.com/js/api.js"], function() {

  // The Browser API key obtained from the Google Developers Console.
  var developerKey = 'AIzaSyBTlxdegC3ouk0lOFntYqH3i6EfMKrjczU';

  // The Client ID obtained from the Google Developers Console. Replace with your own Client ID.
  var clientId = "677268176575-mclkqsbk192lhj1s0vsg65j16ovrj353"

  // Scope to use to access user's files.
  var scope = ['https://www.googleapis.com/auth/drive.readonly'];

  var pickerApiLoaded = false;
  var oauthToken;
  var pickerCallback;

  var 
  doAuth = function() {
    window.gapi.auth.authorize(
      {
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      },
      handleAuthResult);
  },

  onPickerApiLoad = function() {
    pickerApiLoaded = true;
    createPicker();
  },

  handleAuthResult = function(authResult) {
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      createPicker();
    }
  },

  // Create and render a Picker object for picking user files.
  createPicker = function() {
    if (pickerApiLoaded && oauthToken) {
      var fv = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
      var picker = new google.picker.PickerBuilder().
          setTitle("").
          addView(google.picker.ViewId.RECENTLY_PICKED).
          addView(google.picker.ViewId.DOCS).
          addView(fv).
          addView(google.picker.ViewId.DOCUMENTS).
          addView(google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS).
          setOAuthToken(oauthToken).
          // setDeveloperKey(developerKey).
          setCallback(pickerCallback).
          enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
          build();
      picker.setVisible(true);
    }
  };

  var filePicker = {
    pick: function(callback) {
      pickerCallback = function(data) {if (data.action === "picked") {callback(data);}};
      if (gapi.auth && gapi.auth.getToken())
      {
        oauthToken = gapi.auth.getToken().access_token;
        gapi.load('picker', {'callback': onPickerApiLoad});
      }
      else
      {
        gapi.load('auth', {'callback': doAuth});
        gapi.load('picker', {'callback': onPickerApiLoad});
      }
  // Use the API Loader script to load google.picker and gapi.auth.

    }
  }

  return filePicker;

})