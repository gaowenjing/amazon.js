// ==UserScript==
// @name         amazon frontpage
// @namespace    https://github.com/gaowenjing/
// @version      0.4
// @description  amazon frontpage
// @author       You
// @match        https://sellercentral.amazon.com/home*
// @match        https://sellercentral.amazon.com/gp/homepage.html/*
// @match        https://sellercentral-europe.amazon.com/gp/homepage.html/*
// @match        https://sellercentral-europe.amazon.com/home*
// @match        https://sellercentral.amazon.com/payments/reports/*
// @match        https://sellercentral.amazon.com/payments/reports-repository
// @icon         https://www.google.com/s2/favicons?domain=sellercentral.amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/amazon_frontpage.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/amazon_frontpage.user.js
// @grant        none
// ==/UserScript==


{
    const el = document.createElement('script')
    el.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/amazon_frontpage.js')
    document.body.append(el)
}
