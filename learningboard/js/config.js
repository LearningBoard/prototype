define(function() {
  'use strict';

  return {
    /* START CUSTOM CONFIG --> */

    // Name of the application
    appName: 'Learning Boards',

    // Name of the component (will be use in title, e.g. Popular {NAME}, Add a {NAME}, etc)
    componentName: {
      singular: 'Board', // singular noun
      plural: 'Boards' // plural noun
    },

    // RESTful API URL
    serverUrl: 'http://localhost:1337',

    // Media URL (location to user uploaded contents)
    mediaUrl: 'http://localhost:1337/media',

    // Google Analytics
    ganalytics: {
      trackingId: 'UA-79439648-1'
    },

    // Facebook API
    facebook: {
      appId: '1677882592535443',
      apiVersion: 'v2.7'
    },

    // Google Drive picker
    gdrive: {
      developerKey: 'AIzaSyBTlxdegC3ouk0lOFntYqH3i6EfMKrjczU',
      clientId: '677268176575-mclkqsbk192lhj1s0vsg65j16ovrj353',
    },

    // OneDrive picker
    odrive: {
      clientId: '8cfc5300-2316-4282-8781-688551f56c1c'
    }

    /* <-- END CUSTOM CONFIG */
  }

});
