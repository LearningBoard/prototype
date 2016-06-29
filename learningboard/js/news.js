$(document).ready(function(){
  // fetch and render news
  $.get(serv_addr+'/news/getAll/', function(data){
    if(data.news && data.news.length > 0){
      $('div.row .noNews').hide();
      for(var i = 0; i < data.news.length; i++){
        $('div.row').append(`
          <div class="col-md-12">
            <h3>${data.news[i].title}</h3>
            <div>${data.news[i].text}</div>
            <hr />
          </div>`);
      }
    }
  }).fail(function(){
    alert('Error when fetching news');
  });
});
