$(document).ready(function(){
  // display login/logout
  if(localStorage['user_id']){
    $('.navbar-nav .login').addClass('hidden');
    $('.navbar-nav .logout').removeClass('hidden');
  }else{
    $('.navbar-nav .login').removeClass('hidden');
    $('.navbar-nav .logout').addClass('hidden');
  }
  // logout
  $('.navbar-nav .logout').on('click', function(e){
    e.preventDefault();
    localStorage.removeItem('user_id');
    location.reload();
  });
  // dump the nav bar to body
  $('body').prepend(`
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.html">Learning Boards</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right text-center">
            <li><a href="#" class="addBoardBtn">
              <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
              <br />Save Board
            </a></li>
            <li><a href="#" class="deleteBoardBtn">
              <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
              <br />Delete Board
            </a></li>
            <li><a href="#" class="publishBoardBtn">
              <span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span>
              <br />Publish Board
            </a></li>
            <li class="hidden"><a href="#" class="unpublishBoardBtn">
              <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
              <br />Unpublish Board
            </a></li>
            <li><a href="#">
              <span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span>
              <br />Preview Board
            </a></li>
          </ul>
        </div>
      </div>
    </nav>`);
});
