
document.body.addEventListener('click', function(event) {
    if (event.target.matches('[data-item-feedback]')) {
        var name = event.target.getAttribute('data-item-name');
        var category = event.target.getAttribute('data-item-category');
        var action = event.target.getAttribute('data-item-action');

        sendFeebackEvent({
            name: name,
            category: category,
            action: action
        });
    }
});

function sendFeebackEvent(config) {
    if (!_paq) return;

    _paq.push(['trackEvent', config.category, config.action, config.name]);
}