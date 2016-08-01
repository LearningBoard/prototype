define(['activities/ActivityAdapter'], function(ActivityAdapter){
  'use strict';

  var CodeAdapter = function() {
    ActivityAdapter.call(this, 'Code', 'code');
  };

  CodeAdapter.prototype = Object.create(ActivityAdapter.prototype);
  CodeAdapter.prototype.constructor = CodeAdapter;

  CodeAdapter.prototype.renderCustomForm = function() {
    return `
    <div class="form-group">
      <label for="${this.type}_link">Code Link</label>
      <input type="url" class="form-control" id="${this.type}_link" name="${this.type}_link" placeholder="code link (support JSFiddle, Plunker)" pattern=".*(jsfiddle.net|plnkr.co).*" required>
    </div>`;
  };

  CodeAdapter.prototype.renderView = function(modelData) {
    var link = modelData.data.code_link;
    if (link) {
      if (link.match(/jsfiddle\.net/) != null) {
        link = link + 'embedded/';
      } else if(link.match(/plnkr\.co/) != null) {
        link = 'https://embed.plnkr.co/' + link.replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
      }
    }
    return `
    <div class="row">
      <div class="col-md-12">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
        </div>
        <div class="description">${modelData.description}</div>
      </div>
    </div>`;
  };

  return CodeAdapter;
});
