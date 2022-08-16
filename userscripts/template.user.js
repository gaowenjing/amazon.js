// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *
// @icon         https://www.google.com/s2/favicons?domain=dyip.cn
// @updateURL    https://dyip.cn:8443/userscripts/template.user.js
// @downloadURL    https://dyip.cn:8443/userscripts/template.user.js
// @updateURL    https://pi.dyip.cn:8443/userscripts/template.user.js
// @downloadURL    https://pi.dyip.cn:8443/userscripts/template.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn:8443/scripts/template.js')
// el.setAttribute('src', 'https://pi.dyip.cn:8443/scripts/template.js')

document.body.append(el)
