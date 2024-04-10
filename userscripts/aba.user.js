// ==UserScript==
// @name         aba download
// @namespace    https://dyip.cn/
// @version      0.2
// @description  download amazon brand analysis report
// @author       You
// @match        https://sellercentral.amazon.com/analytics/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn/userscripts/aba.user.js
// @downloadURL  https://dyip.cn/userscripts/aba.user.js
// @grant        none
// ==/UserScript==


const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn/scripts/aba.js')

document.body.append(el)
