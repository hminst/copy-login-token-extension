const form = document.getElementById('control-row');
const message = document.getElementById('message');

const LOGIN_TOKEN_COOKIE_NAME = 'login-token';

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  
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

      let message = await copyLoginToken(url.origin);
      setMessage(message);
    } catch {
      // ignore
    }

  }
}

async function copyLoginToken(origin) {
    try {
      const loginTokenCookie = await chrome.cookies.get({url:origin, name: LOGIN_TOKEN_COOKIE_NAME})

      if(!loginTokenCookie) {
        return 'login-token not found!'
      }
      const loginTokenValue = loginTokenCookie.value;
      chrome.cookies.set(
        { domain: 'localhost', name: LOGIN_TOKEN_COOKIE_NAME, value: loginTokenValue, url: 'http://localhost', path: '/' }
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
