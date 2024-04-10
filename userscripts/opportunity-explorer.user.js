// ==UserScript==
// @name         opportunity-explorer
// @namespace    https://dyip.cn/
// @version      0.2
// @description  opportunity-explorer
// @author       You
// @match        https://sellercentral.amazon.com/opportunity-explorer/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn/userscripts/opportunity-explorer.user.js
// @downloadURL  https://dyip.cn/userscripts/opportunity-explorer.user.js
// @grant        none
// ==/UserScript==

{
    const el = document.createElement('script')
    el.setAttribute('src', 'https://dyip.cn/scripts/opportunity-explorer.js')
    document.body.append(el)
}
