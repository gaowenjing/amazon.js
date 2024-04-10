// ==UserScript==
// @name         auto download report
// @namespace    https://dyip.cn/
// @version      0.3
// @description  auto downlaod report
// @author       You
// @match        https://sellercentral.amazon.com/reportcentral/*
// @match        https://sellercentral-europe.amazon.com/reportcentral/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @updateURL    https://dyip.cn/userscripts/report_download.user.js
// @downloadURL  https://dyip.cn/userscripts/report_download.user.js
// ==/UserScript==

const sc = document.createElement('script')

sc.setAttribute('src', 'https://dyip.cn/scripts/report_download.js')

document.body.append(sc)