$(document).ready(function() {
  $('.toggle-password').click(function() {
    $(this).toggleClass('toggle-password--enabled');
    var input = $('#password');
    var type = input.attr('type') === 'password' ? 'text' : 'password';
    var content = type === 'password' ? 'Show' : 'Hide';
    input.attr('type', type);
    $(this).html(content);
  });
});
