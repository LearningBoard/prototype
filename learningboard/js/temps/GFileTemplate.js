define(['util', 'mdls/GFile', 'temps/ListElementTemplate'], function(util, GFile, ListElementTemplate) {
  "use strict";

  var GFileTemplate = function(fileObject, index)
  {
    this.model = new GFile(fileObject);

    console.log(this.model);

    var icon_cdn = "http://cdn.webiconset.com/file-type-icons/images/icons/";

    var icon_src;
    switch (fileObject.mimeType)
    {
      case "application/vnd.google-apps.presentation":
      icon_src = "/img/google-product-logos/logo_slides_128px.png";
      break;

      case "application/vnd.google-apps.document":
      icon_src = "/img/google-product-logos/logo_docs_128px.png";
      break;

      case "application/vnd.google-apps.spreadsheet":
      icon_src = "/img/google-product-logos/logo_sheets_128px.png";
      break;

      case "application/pdf":
      icon_src = icon_cdn + "pdf.png";
      break;

      default:
      icon_src = icon_cdn + "blank.png";
      break;
    }

    var html = `
    <div class="fileDisplay">
      <img src=${icon_src} class="fileIcon"></img>
      <br/>
      <p>${util.strTrunc(this.model.name, 8)}</p>
    </div>
    `;
    ListElementTemplate.call(this, $(html), index);
  }

  $.extend(GFileTemplate.prototype, ListElementTemplate.prototype);

  return GFileTemplate;
});

