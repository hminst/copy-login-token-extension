# AEM Quicksite creation support
AEM quicksite creation using the local node live proxy to an AEM environment needs a login token.
It is fairly easy when local users are available, but not when everything is SSO via IMS and local users are not allowed.

To use the live proxy with such environments as well, the login-token cookie needs to be copied to localhost.

This can be a tedious process, but this Extension does the job for you.

## Installation
Since this is not an approved Extension available through the marketplace, it is necessary to follow the instructions on https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked after cloning this repository.


## Usage
Once installed, navigate to your AEMaaCS instance and click on the plugin icon.
Two actions are available:
- "Copy Token" copies the login-token to the localhost context
- "Open Page" opens the current page (editor or sites navigation) in a new tab in your localhost proxy

![Extension Open](./readme-files/extension-opened.PNG)
