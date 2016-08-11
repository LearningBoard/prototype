define(['util'], function(util)
{
  $(function(){
    // fetch and render news
    util.get('/news',
      function(data)
      {
        if(data.news && data.news.length > 0)
        {
          $('div.row .noNews').hide();
          for(var i = 0; i < data.news.length; i++)
          {
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
              </div>`
            );
          }
        }
      }
    );
  });
});
