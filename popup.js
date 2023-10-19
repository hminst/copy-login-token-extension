const tokenButton = document.getElementById('token');
const wcmmodeButton = document.getElementById('wcmmode');
const message = document.getElementById('message');

const LOGIN_TOKEN_COOKIE_NAME = 'login-token';
const WCMMODE_COOKIE_NAME = 'wcmmode';

let currentUrl;

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    currentUrl = new URL(tab.url);
    if (!currentUrl) {
      throw Error('url could not be identified');
    }
    if (currentUrl.hostname == 'localhost') {
      tokenButton.remove();
    } else {
      wcmmodeButton.remove();
    }

  }
  updateWCMmodeButton();
})();

tokenButton.addEventListener('click', handleTokenSync);
wcmmodeButton.addEventListener('click', handleWCMMode);

async function handleWCMMode(event) {
  event.preventDefault();
  let wcmmode = 'disabled'
  const wcmmodeCookie = await chrome.cookies.get({ url: currentUrl.origin, name: WCMMODE_COOKIE_NAME })
  if (wcmmodeCookie) {
    if (wcmmodeCookie.value != 'enabled') {
      wcmmode = 'enabled'
    } else {
      wcmmode = 'disabled'
    }
  }

  chrome.cookies.set(
    { domain: currentUrl.hostname, name: WCMMODE_COOKIE_NAME, value: wcmmode, url: currentUrl.origin, path: '/' }
  );

  updateWCMmodeButton();
}


async function updateWCMmodeButton() {
  const wcmmodeCookie = await chrome.cookies.get({ url: currentUrl.origin, name: WCMMODE_COOKIE_NAME })

  if (wcmmodeCookie) {
    wcmmodeButton.innerText = `WCMMODE=${wcmmodeCookie.value}`;
  } else {
    wcmmodeButton.innerText = `WCMMODE=?`;
  }
  var code = 'window.location.reload();';
  chrome.scripting.executeScript(code)
}

async function handleTokenSync(event) {
  event.preventDefault();

  try {
    const loginTokenCookie = await chrome.cookies.get({ url: origin, name: LOGIN_TOKEN_COOKIE_NAME })

    if (!loginTokenCookie) {
      setMessage(tokenButton, 'login-token not found!')
    }
    const loginTokenValue = loginTokenCookie.value;
    chrome.cookies.set(
      { domain: 'localhost', name: LOGIN_TOKEN_COOKIE_NAME, value: loginTokenValue, url: 'http://localhost', path: '/' }
    )

  } catch (error) {
    setMessage(tokenButton, `Unexpected error: ${error.message}`)

  }
  setMessage(tokenButton, 'token synchornized')

}

async function copyLoginToken(origin) {

}

function setMessage(element, str) {
  tokenButton.textContent = str;
}
