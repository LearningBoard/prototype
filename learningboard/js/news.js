$(function(){
  if(!localStorage.user_id){
    alert('Login required!');
    location.href = 'login.html';
    return;
  }

  // fetch and render news
  $.get(serv_addr+'/news/?user_id='+localStorage.user_id+'&is_staff='+localStorage.is_staff, function(data){
    if(data.news && data.news.length > 0){
      $('div.row .noNews').hide();
      for(var i = 0; i < data.news.length; i++){
        $('div.row').append(`
          <div class="col-md-12">
            <h3>${data.news[i].title}</h3>
            <p>
              Learning Board: <a href="board_view.html?${data.news[i].lb.id}" target="_blank">${data.news[i].lb.title}</a>
              |
              Author: ${data.news[i].lb.author}
            </p>
            <div>${data.news[i].text}</div>
            <hr />
          </div>`);
      }
    }
  }).fail(function(){
    alert('Error when fetching news');
  });
});
