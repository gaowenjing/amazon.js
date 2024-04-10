// ==UserScript==
// @name         fba fee
// @namespace    https://github.com/gaowenjing/
// @version      0.2
// @description  get fba fee
// @author       You
// @match        https://sellercentral.amazon.com/inventoryplanning/manageinventoryhealth*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/template.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/template.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/fbafee.js')

document.body.append(el)
