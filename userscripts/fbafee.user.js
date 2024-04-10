// ==UserScript==
// @name         fba fee
// @namespace    https://dyip.cn/
// @version      0.2
// @description  get fba fee
// @author       You
// @match        https://sellercentral.amazon.com/inventoryplanning/manageinventoryhealth*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn/userscripts/fbafee.user.js
// @downloadURL  https://dyip.cn/userscripts/fbafee.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn/scripts/fbafee.js')

document.body.append(el)
