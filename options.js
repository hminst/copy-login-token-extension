(function () {

    const portInputField = document.getElementById('port');

    chrome.storage.sync.get({port: '7000'}, function (configItems) {
        portInputField.value = configItems.port;
    })

    const form = document.getElementById('options-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log(portInputField.value)
        chrome.storage.sync.set(
            { port: portInputField.value }
          );
    })

})();


