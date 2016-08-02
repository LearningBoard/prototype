define(['mdls/GFile', 'temps/Template'], function(GFile, Template) {
  "use strict";

  /**
   * @constructor
   * @param {Array} gfiles - a list of google files
   */
  var GDriveTemplate = function(data) {
    console.log(data);

    var $html = $("<div class='fileView'></div>");
    $html.append(`
      <div class="carousel slide" data-ride="carousel" style="width: 100%; height: 500px">
        <!-- Indicators -->
        <ol class="carousel-indicators">
          <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
          <li data-target="#carousel-example-generic" data-slide-to="1"></li>
          <li data-target="#carousel-example-generic" data-slide-to="2"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
          <div class="item active">
          </div>
          <div class="item">
          </div>
        </div>

        <!-- Controls -->
        <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
          <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
    `);
    data.fileList = data.fileList.map(function(ele){return new GFile(ele);});
    this.model = data;

    var fileList = this.model.fileList;
    var len = fileList.length;
    var src, file, $iframeHtml;
    var doc_src_pre = 'https://docs.google.com/viewer?srcid=';
    var doc_src_suf = '&pid=explorer&efh=false&a=v&chrome=false&embedded=true';
    for (var ii = 0; ii < len; ++ii)
    {
      file = fileList[ii];
      switch (file.mimeType)
      {
        case "application/pdf":
        case "application/vnd.google-apps.presentation":
        case "application/vnd.google-apps.document":
        case "application/vnd.google-apps.spreadsheet":
        case "application/vnd.google-apps.photo":
        src = doc_src_pre + file.id + doc_src_suf;
        break;

        default:
        src = doc_src_pre + file.id + doc_src_suf;
        break;
      }
      $iframeHtml = $(`<div class="item ${ii===0?"active":""}"><iframe class="file ${"file-"+file.type}" src=${src}></iframe></div>`);

      $html.find(".carousel .carousel-inner").append($iframeHtml);
    }
    Template.call(this, $html)
  };

  $.extend(GDriveTemplate.prototype, Template.prototype);

  return GDriveTemplate;

});