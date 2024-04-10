// ==UserScript==
// @name         aba download
// @namespace    https://github.com/gaowenjing/
// @version      0.2
// @description  download amazon brand analysis report
// @author       You
// @match        https://sellercentral.amazon.com/analytics/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/aba.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/aba.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/aba.js')

document.body.append(el)
