// ==UserScript==
// @name         sp advertised product report downloader
// @namespace    https://dyip.cn/
// @version      0.6
// @description  sp ap report downloader
// @author       You
// @match        https://advertising.amazon.com/sspa/*
// @match        https://advertising.amazon.com/reports*
// @match        https://advertising.amazon.co.uk/sspa/*
// @match        https://advertising.amazon.co.uk/reports*
// @icon         https://www.google.com/s2/favicons?domain=advertising.amazon.com
// @updateURL    https://dyip.cn/userscripts/sp_ap_daily.user.js
// @downloadURL  https://dyip.cn/userscripts/sp_ap_daily.user.js
// @grant        none
// ==/UserScript==

const sc = document.createElement('script')

sc.setAttribute('src', 'https://dyip.cn/scripts/sp_ap_daily.js')

document.body.append(sc)