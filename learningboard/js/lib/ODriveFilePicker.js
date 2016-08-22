define(["OneDrive", 'util'], function(OneDrive, util) {
  "use strict";

  var cancel = function(data)
  {
    console.log("cancelled");
    console.log(data);
  };

  var error = function(data)
  {
    console.log(data);
  };

  var odOptions = { /* ... specify the desired options ... */ 
    clientId: "8cfc5300-2316-4282-8781-688551f56c1c",
    action: "share",
    advanced: {
      redirectUri: util.getAppRootUrl() + "/ofilepicker.html",
      createLinkParameters: {type: "embed"}
    },
    linkType: "webviewlink",
    multiSelect: true,
  };

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
    pick: function (success, options) {
      console.log("here");
      if (options === undefined) options = {};
      if (options.cancel === undefined) options.cancel = cancel;
      if (options.error === undefined) options.error = error;

      odOptions.success = success;
      odOptions.cancel = cancel;
      odOptions.error = error;

      OneDrive.open(odOptions);
    },

    /* deprecated
    createPickButton: function (success, options) {
      console.log("here");
      if (options === undefined) options = {};
      if (options.cancel === undefined) options.cancel = cancel;
      if (options.error === undefined) options.error = error;

      odOptions.success = success;
      odOptions.cancel = cancel;
      odOptions.error = error;

      return OneDrive.createOpenButton(odOptions);
    }
    */
  };

  return ODriveFilePicker;
});
