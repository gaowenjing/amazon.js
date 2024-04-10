// ==UserScript==
// @name         opportunity-explorer
// @namespace    https://github.com/gaowenjing/
// @version      0.2
// @description  opportunity-explorer
// @author       You
// @match        https://sellercentral.amazon.com/opportunity-explorer/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/opportunity-explorer.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/opportunity-explorer.user.js
// @grant        none
// ==/UserScript==

{
    const el = document.createElement('script')
    el.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/opportunity-explorer.js')
    document.body.append(el)
}
