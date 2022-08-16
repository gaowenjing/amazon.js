// ==UserScript==
// @name         aba download
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.com/analytics/*
// @icon         https://www.google.com/s2/favicons?domain=dyip.cn
// @updateURL    https://dyip.cn:8443/userscripts/aba.user.js
// @downloadURL    https://dyip.cn:8443/userscripts/aba.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn:8443/scripts/aba.js')
// el.setAttribute('src', 'https://pi.dyip.cn:8443/scripts/aba.js')

document.body.append(el)
