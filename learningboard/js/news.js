define(['util', 'temps/NewsListTemplate', 'temps/NewsTemplate'], function(util, NewsListTemplate, NewsTemplate)
{
  $(function(){
    // fetch and render news
    util.get('/user/news',
      function(res)
      {
        var data = res.data.news;
        if(data && data.length) {
          data = data.map(function(item, i) {
            return new NewsTemplate(item, i);
          });
          var list = new NewsListTemplate(data);
          list.display($('#newsListContainer'));
        } else {
          var list = new NewsListTemplate();
          list.display($('#newsListContainer'));
        }
      }
    );
  });
});
