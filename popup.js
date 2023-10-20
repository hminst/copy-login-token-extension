const copyTokenButton = document.getElementById('copy-token');
const message = document.getElementById('message');
const openProxyPageButton = document.getElementById('open-via-proxy');

const LOGIN_TOKEN_COOKIE_NAME = 'login-token';
const LOCAL_PROXY = 'http://localhost:7000'

// The async IIFE is necessary because Chrome <89 does not support top level await.
async function initPopupWindow() {
  const url = await resolveCurrentUrl();
  console.log(url)
  if (!url.origin.includes('adobeaemcloud.com')) {
    copyTokenButton.setAttribute('disabled', 'disabled')
    openProxyPageButton.setAttribute('disabled', 'disabled')
    setMessage('please go to the desired AEMaaCS tab to use the actions.')
  }
};

document.addEventListener("DOMContentLoaded", initPopupWindow);
copyTokenButton.addEventListener('click', copyLoginToken);
openProxyPageButton.addEventListener('click', openProxyPage);

async function openProxyPage(event) {
  event.preventDefault();
  const url = await resolveCurrentUrl();
  copyLoginToken()
  const regex = /(\/content.*)/g;
  let hash = url.hash;

  let path;
  if (hash && (hash.includes('/aem/sites.html') || hash.includes('/aem/editor.html'))) {
    path = hash.match(regex);
  } else {
    path = url.pathname.match(regex);
  }
  console.log(path)
  const urlToOpen = new URL(`${LOCAL_PROXY}${path}.html`)
  urlToOpen.searchParams.append('wcmmode', 'disabled')
  window.open(urlToOpen);
}

async function resolveCurrentUrl() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      let url = new URL(tab.url);
      return url;
    } catch {
      // ignore
    }
  }
}


async function copyLoginToken(event) {
  if (event) {
    event.preventDefault();
  }
  const url = await resolveCurrentUrl();
  try {
    const loginTokenCookie = await chrome.cookies.get({ url: url.origin, name: LOGIN_TOKEN_COOKIE_NAME })

    if (!loginTokenCookie) {
      setMessage('login-token not found!')
    }
    const loginTokenValue = loginTokenCookie.value;
    chrome.cookies.set(
      { domain: 'localhost', name: LOGIN_TOKEN_COOKIE_NAME, value: loginTokenValue, url: 'http://localhost', path: '/' }
    )

  } catch (error) {
    setMessage(`Unexpected error: ${error.message}`);
  }
  setMessage(`token copied!`);
}

function setMessage(str) {
  message.textContent = str;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = '';
}
