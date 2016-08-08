define(["OneDrive"], function(OneDrive) {
  "use strict";

  var cancel = function(data)
  {
    console.log("cancelled");
    console.log(data);
  }

  var error = function(data)
  {
    console.log(data);
  }

  /**
   * @method pick
   */
  var ODriveFilePicker = {

    /**
     * @param {function} success: callback function on success
     * @param {object} options
     * @prop {function} options.cancel: callback on cancel
     * @default {function} options.cancel: cancel
     * @prop {function} options.error: callback on error
     * @default {function} options.error: error
     */
    pick: function launchOneDrivePicker(success, options) {
      console.log("here");
      if (options === undefined) 
      {
        options = {
          cancel: cancel, 
          error: error
        };
      }

      var odOptions = { /* ... specify the desired options ... */ 
        clientId: "8cfc5300-2316-4282-8781-688551f56c1c",
        action: "share",
        advanced: {
          redirectUri: "http://localhost:8000/ofilepicker.html",
          createLinkParameters: {type: "embed"}
        },
        linkType: "webViewLink",
        multiSelect: true,
        success: success, 
        cancel: options.cancel,
        error: options.error
      };
      console.log("started");
      OneDrive.open(odOptions);
      console.log("finished");
    }
  };

  return ODriveFilePicker;

})
