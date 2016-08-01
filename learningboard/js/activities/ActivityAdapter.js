define(function(){
  'use strict';

  var ActivityAdapter = function (name, type){
    this.name = name; // Activity type, human readable name
    this.type = type ? type.toLowerCase() : type; // Activity type, also act as a namespace
  };

  // Custom field for this activity type (other than title & description)
  ActivityAdapter.prototype.renderCustomForm = function() {
    return '';
  };

  // Render content part of activity
  ActivityAdapter.prototype.renderView = function(modelData) {
    return `
    <div class="row">
      <div class="col-md-12">
        <p><i>Error occur when rendering activity</i></p>
      </div>
    </div>`;
  };

  // Actions to perform before creating new activity
  ActivityAdapter.prototype.beforeCreate = function() {
  };

  // Actions to perform after created new activity
  ActivityAdapter.prototype.afterCreate = function(modelData) {
  };

  // Actions to perform before editing activity
  ActivityAdapter.prototype.beforeEdit = function(modelData) {
  };

  // Actions to perform after edited activity
  ActivityAdapter.prototype.afterEdit = function(modelData) {
  };

  return ActivityAdapter;
});
