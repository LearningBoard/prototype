define(['./Template'], function (Template) {
  'use strict';

  var ActivityFormTemplate = function(adapter) {

    var html = `
    <div role="tabpanel" class="tab-pane" id="${adapter.type}">
      <form class="addActivityForm">
        <input type="hidden" name="id" value="">
        <input type="hidden" name="type" value="${adapter.type}">
        <div class="form-group">
          <label for="${adapter.type}_title">Title</label>
          <input type="text" class="form-control" id="${adapter.type}_title" name="title" placeholder="activity title" required>
        </div>
        <div id="customForm"></div>
        <div class="form-group">
          <label for="${adapter.type}_description">Description</label>
          <textarea class="form-control" id="${adapter.type}_description" name="description" rows="3" placeholder="Description"></textarea>
        </div>
        <button type="submit" class="btn btn-default addActivityBtn">Submit</button>
        <span class="result_msg"></span>
      </form>
    </div>`;
    Template.call(this, $(html));
    var $custForm = adapter.renderCustomForm();
    this.$template.find("#customForm").append($custForm);
    console.log($custForm);

  };

  $.extend(ActivityFormTemplate.prototype, Template.prototype);
  return ActivityFormTemplate;
});
