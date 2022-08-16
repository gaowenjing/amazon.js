// ==UserScript==
// @name         Router midnight restart
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to restart router at midnight
// @author       You
// @match        http://192.168.1.1/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @updateURL   https://pi.dyip.cn:8443/userscripts/router_midnight_restart.user.js
// @downloadURL https://pi.dyip.cn:8443/userscripts/router_midnight_restart.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://pi.dyip.cn:8443/scripts/router_midnight_restart.js')

document.body.append(el)