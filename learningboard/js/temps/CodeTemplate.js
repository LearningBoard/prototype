define(['temps/Template', 'models/Code'], function(Template, Code) {
  "use strict";

  var CodeTemplate = function(code, parent) {
    this.parentModel = parent;
    this.model = new Code(code);
    var link = this.model.code_link;

    // handle different links
    if(link){
      if(link.match(/jsfiddle\.net/) != null){
        link = link + 'embedded/';
      }else if(link.match(/plnkr\.co/) != null){
        link = 'https://embed.plnkr.co/'
        + link.replace('/edit/', '/').match(/plnkr\.co\/(\w+)/)[1] + '?deferRun';
      }else if(link.match(/codepen\.io/) != null){
        link = link.replace('/pen/', '/embed/preview/');
      }
    }

    var $html = $(`
      <div class="embed-responsive embed-responsive-16by9 activity-code">
        <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
      </div>
    `);
    Template.call(this, $html);
  };

  $.extend(CodeTemplate.prototype, Template.prototype);

  return CodeTemplate;

});
