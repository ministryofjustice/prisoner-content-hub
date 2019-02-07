var commentBox = document.querySelector('[data-item-comment-box]');
var feedbackText = document.querySelector('[data-item-feedback-text]');

document.body.addEventListener('click', function(event) {
    if (event.target.matches('[data-item-feedback]')) {
        var details = {
            name: event.target.getAttribute('data-item-name'),
            category: event.target.getAttribute('data-item-category'),
            action: event.target.getAttribute('data-item-action')
        };

        var isActive = event.target.classList.contains('is-selected');

        clearFeedbacktext();

        if (isActive) {
            hideCommentBoxForm();
            deselectThumbs();
            sendUnSelectFeedbackEvent(details);
        }  else {
            deselectThumbs();
            updateFeedbacktext(details.action, details.category)

            sendFeebackEvent(details);
            selectThumb(event.target);
            updateCommentBoxDetails(details);
            revealCommentBoxForm();
        }
    }

    return false;
});

document.body.addEventListener('submit', function(event) {
    if (event.target.matches('[data-item-comment]')) {
        event.preventDefault();
        var details = {
            name: event.target.getAttribute('data-item-name'),
            category: event.target.getAttribute('data-item-category'),
            action: event.target.getAttribute('data-item-action'),
            value: event.target.querySelector('textarea').value
        };

        sendFeebackEvent(details);
        setTimeout(function() {
            hideCommentBoxForm();
        }, 1500);
    }

    return false;
});

if (commentBox) {
    commentBox.addEventListener('keyup', handleTextBoxInput);
    commentBox.addEventListener('paste', function (event) {
       setTimeout(function() {
           handleTextBoxInput(event);
       },1); 
    });
}

function handleTextBoxInput(event) {
    var characterCountElem = document.querySelector('[data-item-counter]');
    var charCount = commentBox.value.length;
    var charMax = commentBox.getAttribute('maxlength');

    characterCountElem.textContent = charMax - charCount;
}


function sendFeebackEvent(config) {
    if (!_paq) return;

    var event = ['trackEvent', config.category, config.action, config.name];

    if (config.value) {
        event.push(config.value);
    }

    _paq.push(event);
}

function sendUnSelectFeedbackEvent(config) {
    var newConfig = Object.assign(config, { action: "UN" + config.action });
    sendFeebackEvent(newConfig);
}

function updateCommentBoxDetails(details) {
    var commentBoxForm = document.querySelector('[data-item-comment]');

    if (!commentBoxForm) return;

    commentBoxForm.setAttribute('data-item-name', details.name);
    commentBoxForm.setAttribute('data-item-category', details.category);
    commentBoxForm.setAttribute('data-item-action', details.action);
}

function revealCommentBoxForm() {
    var commentBoxForm = document.querySelector('[data-item-comment]');

    if (!commentBoxForm) return;

    commentBoxForm.classList.remove('govuk-u-hidden')
}

function selectThumb(element) {
    element.classList.add('is-selected');
}

function deselectThumbs() {
    var thumbs =  document.querySelectorAll('[data-item-feedback]');

    Array.from(thumbs).forEach(function(thumb) {
        thumb.classList.remove('is-selected');
    });
}


function hideCommentBoxForm() {
    var commentBoxForm = document.querySelector('[data-item-comment]');

    if (!commentBoxForm) return;
    commentBoxForm.querySelector('textarea').value = '';
    commentBoxForm.classList.add('govuk-u-hidden');
    handleTextBoxInput();
}

function clearFeedbacktext() {
    feedbackText.textContent = ""
}

function updateFeedbacktext(feedback, type) {
    var types = {
        video: "video",
        radio: "audio",
        page: "article"
    };

    if (feedback === 'LIKE') {
        feedbackText.textContent = "I like this " + types[type];
    } else {
        feedbackText.textContent = "I do not like this " + types[type];
    }

}