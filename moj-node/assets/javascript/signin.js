$(document).ready(function () {
  $('.toggle-password').click(function () {
    $(this).toggleClass('toggle-password--enabled');
    var input = $('#password');
    var type = input.attr('type') === 'password' ? 'text' : 'password';
    var content = type === 'password' ? 'Show' : 'Hide';
    input.attr('type', type);
    $(this).html(content);
  });

  function cleanErrors() {
    $('.govuk-form-group').removeClass('govuk-form-group--error');
    $('.govuk-error-message,.govuk-error-summary').remove();
    $('.signin').prepend(
      '<div class="govuk-error-summary" style="display: none;" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary"><h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2><div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"></ul></div></div>',
    );
  }

  function addFieldError(fieldName, message) {
    $(`#${fieldName}`).parent().addClass('govuk-form-group--error');
    $(
      `<span id="${fieldName}-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> ${message}</span>`,
    ).insertBefore(`#${fieldName}`);
    $('.govuk-error-summary').show();
    $('.govuk-error-summary__list').prepend(
      `<li><a href="#${fieldName}">${message}</a></li>`,
    );
  }

  $('#signin-form').submit(function (e) {
    var hasError = false;
    var pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);

    cleanErrors();

    if (!pattern.test($('#username').val())) {
      hasError = true;
      addFieldError('username', 'Enter a username in the correct format');
    }

    if ($('#password').val().length === 0) {
      hasError = true;
      addFieldError('password', 'Enter a password in the correct format');
    }

    if (!hasError) {
      return;
    }

    e.preventDefault();
  });
});
