define(['temps/Template', 'models/Code'], function(Template, Code) {
  "use strict";

  var CodeTemplate = function(code) {
    this.model = new Code(code);
    var link = this.model.code_link;

    // handle different links
    if(link){
      if(code_link.match(/jsfiddle\.net/) != null){
        link = link + 'embedded/';
      }else if(code_link.match(/plnkr\.co/) != null){
        link = 'https://embed.plnkr.co/' 
        + code_link.replace('/edit/', '/').match(/plnkr\.co\/(.*)/)[1];
      }
    }

    $html = $(`
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
      </div>
    `);
    Template.call(this, $html);
  };

  $.extend(CodeTemplate.prototype, Template.prototype);

  return CodeTemplate;

})