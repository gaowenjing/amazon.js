// ==UserScript==
// @name         auto upload business report daily
// @namespace    https://github.com/gaowenjing/
// @version      0.3
// @description  auto upload business report daily
// @author       You
// @match        https://sellercentral.amazon.com/business-reports/*
// @match        https://sellercentral-europe.amazon.com/business-reports/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://github.com/gaowenjing/amazon.js/raw/main/userscripts/business_report_upload.user.js
// @downloadURL  https://github.com/gaowenjing/amazon.js/raw/main/userscripts/business_report_upload.user.js
// @grant        none
// ==/UserScript==
const sc = document.createElement('script')

sc.setAttribute('src', 'https://github.com/gaowenjing/amazon.js/raw/main/scripts/business_report_upload.js')

document.body.append(sc)