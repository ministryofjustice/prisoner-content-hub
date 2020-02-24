$(document).ready(function() {
  $('.toggle-password').click(function() {
    $(this).toggleClass('toggle-password--enabled');
    var input = $('#password');
    input.attr('type', input.attr('type') == 'password' ? 'text' : 'password');
  });
});
