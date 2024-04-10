// ==UserScript==
// @name         download and auto upload report
// @namespace    https://dyip.cn/
// @version      0.6
// @description  download and auto upload report
// @author       You
// @match        https://sellercentral.amazon.com/reportcentral/*
// @match        https://sellercentral-europe.amazon.com/reportcentral/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn/userscripts/auto_upload_report.user.js
// @downloadURL  https://dyip.cn/userscripts/auto_upload_report.user.js
// @grant        none
// ==/UserScript==

const el = document.createElement('script')
el.setAttribute('src', 'https://dyip.cn/scripts/auto_upload_report.js')

document.body.append(el)