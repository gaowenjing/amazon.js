// ==UserScript==
// @name         analysis brand review page
// @namespace    https://github.com/gaowenjing/
// @version      0.2
// @description  analysis brand review
// @author       You
// @match        https://sellercentral.amazon.com/brand-customer-reviews/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/brandreview.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/brandreview.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/brandreview.js')

document.body.append(el)
