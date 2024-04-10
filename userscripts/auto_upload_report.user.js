// ==UserScript==
// @name         download and auto upload report
// @namespace    https://github.com/gaowenjing/
// @version      0.6
// @description  download and auto upload report
// @author       You
// @match        https://sellercentral.amazon.com/reportcentral/*
// @match        https://sellercentral-europe.amazon.com/reportcentral/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/auto_upload_report.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/auto_upload_report.user.js
// @grant        none
// ==/UserScript==

const el = document.createElement('script')
el.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/auto_upload_report.js')

document.body.append(el)