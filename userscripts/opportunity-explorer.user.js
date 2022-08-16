// ==UserScript==
// @name         opportunity-explorer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  opportunity-explorer
// @author       You
// @match        https://sellercentral.amazon.com/opportunity-explorer/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn:8443/userscripts/opportunity-explorer.user.js
// @downloadURL  https://dyip.cn:8443/userscripts/opportunity-explorer.user.js
// @grant        none
// ==/UserScript==

{
    const el = document.createElement('script')
    el.setAttribute('src', 'https://dyip.cn:8443/scripts/opportunity-explorer.js')
    document.body.append(el)
}
