// ==UserScript==
// @name         analysis brand review page
// @namespace    https://dyip.cn/
// @version      0.2
// @description  analysis brand review
// @author       You
// @match        https://sellercentral.amazon.com/brand-customer-reviews/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn/userscripts/brandreview.user.js
// @downloadURL  https://dyip.cn/userscripts/brandreview.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn/scripts/brandreview.js')

document.body.append(el)
