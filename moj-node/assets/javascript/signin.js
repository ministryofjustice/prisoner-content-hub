$(document).ready(function() {
  $('.toggle-password').click(function() {
    $(this).toggleClass('toggle-password--enabled');
    var input = $('#password');
    var type = input.attr('type') === 'password' ? 'text' : 'password';
    var content = type === 'password' ? 'Show' : 'Hide';
    input.attr('type', type);
    $(this).html(content);
  });


  $('#signin-form').submit(function(e) {
    e.preventDefault();
    let errors = false;
    const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);

    if (!pattern.test($('#username').val())) {
      errors = true;
      $('#username').parent().addClass('govuk-form-group--error');
      $('<span id="username-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter a username in the correct format</span>').insertBefore('#username');
    }

    if ($('#password').val().length === 0) {
      errors = true;
      $('#password').parent().addClass('govuk-form-group--error');
      $('<span id="password-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter a password in the correct format</span>').insertBefore('#password');
    }

    /*
    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">
There is a problem
</h2>
<div class="govuk-error-summary__body">

<ul class="govuk-list govuk-error-summary__list">

  <li>

    <a href="#username">Enter a username in the correct format</a>

  </li>

  <li>

    <a href="#password">Enter a password in the correct format</a>

  </li>

</ul>
</div>
</div>
    */

    return errors;
  });
});
