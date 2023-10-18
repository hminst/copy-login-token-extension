const form = document.getElementById('control-row');
const message = document.getElementById('message');

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    try {
      let url = new URL(tab.url);
    } catch {
      // ignore
    }
  }
})();

form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();

  clearMessage();
  
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    try {
      let url = new URL(tab.url);

      if (!url) {
        setMessage('Invalid URL');
        return;
      }

      let message = await copyLoginToken(url.hostname);
      setMessage(message);
    } catch {
      // ignore
    }

  }
}

async function copyLoginToken(domain) {
    let logintoken;
    try {
      const cookies = await chrome.cookies.getAll({ domain });

      if (cookies.length === 0) {
        return 'login-token not found';
      }


      cookies.forEach((cookie) => {
        console.log(cookie)
        if (cookie.name == "login-token") {
          logintoken = cookie.value
        }
      })

      chrome.cookies.set(
        { domain: 'localhost', name: 'login-token', value: logintoken, url: 'http://localhost', path: '/' }
      )

    } catch (error) {
      return `Unexpected error: ${error.message}`;
    }

    return `token copied!`;
  }

  function setMessage(str) {
    message.textContent = str;
    message.hidden = false;
  }

  function clearMessage() {
    message.hidden = true;
    message.textContent = '';
  }
