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
});
