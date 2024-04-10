// ==UserScript==
// @name         MPC-S auto add
// @namespace    https://dyip.cn/
// @version      0.3
// @description  auto add mpc-s promotion
// @author       You
// @match        https://sellercentral.amazon.com/promotions/*
// @match        https://sellercentral-europe.amazon.com/promotions/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @updateURL    https://dyip.cn/userscripts/mpc-s-auto.user.js
// @downloadURL  https://dyip.cn/userscripts/mpc-s-auto.user.js
// @grant        none
// ==/UserScript==

const sc = document.createElement('script')

sc.setAttribute('src', 'https://dyip.cn/scripts/mpc-s-auto.js')

document.body.append(sc)