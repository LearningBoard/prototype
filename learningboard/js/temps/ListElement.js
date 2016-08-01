define(function() {
  var ListElement = function(index) {
    this.index = index;
  }

  ListElement.prototype.updateIndex = function () {
    this.index = index++;
    this.$template.find(".index").html(index < 10 ? '0' + index : index);
  }

  return ListElement;
})