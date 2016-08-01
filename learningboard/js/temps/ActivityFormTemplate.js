define(['./Template'], function (Template) {
  'use strict';

  var ActivityFormTemplate = function(adapter) {

    this.impl = adapter;
    console.log(adapter);

    var html = `
    <div role="tabpanel" class="tab-pane" id="${this.adapter.type}">
      <form class="addActivityForm">
        <input type="hidden" name="id" value="">
        <input type="hidden" name="type" value="${this.adapter.type}">
        <div class="form-group">
          <label for="${this.adapter.type}_title">Title</label>
          <input type="text" class="form-control" id="${this.adapter.type}_title" name="title" placeholder="activity title" required>
        </div>
        <div id="customForm"></div>
        <div class="form-group">
          <label for="${this.adapter.type}_description">Description</label>
          <textarea class="form-control" id="${this.adapter.type}_description" name="description" rows="3" placeholder="Description"></textarea>
        </div>
        <button type="submit" class="btn btn-default addActivityBtn">Submit</button>
        <span class="result_msg"></span>
      </form>
    </div>`;
    Template.call(this, $(html));
    var $custForm = adapter.renderCustomForm();
    this.$template.find("#customForm").append($custForm);

  };

  ActivityFormTemplate.prototype.beforeCreate = function() {
    this.adapter.beforeCreate(this.$template);
  };

  ActivityFormTemplate.prototype.afterCreate = function(modelData) {
    this.adapter.afterCreate(this.$template, modelData);
  };

  ActivityFormTemplate.prototype.beforeEdit = function(modelData) {
    this.adapter.beforeEdit(this.$template, modelData);
  };

  ActivityFormTemplate.prototype.afterEdit = function(modelData) {
    this.adapter.afterEdit(this.$template, modelData);
  };

  $.extend(ActivityFormTemplate.prototype, Template.prototype);
  return ActivityFormTemplate;
});
