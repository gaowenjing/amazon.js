// ==UserScript==
// @name         order to messager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.com/orders-v3/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let el = document.createElement('span');
    el.classList.add('a-button');
    el.innerHTML = `
    <a class="a-button-text" role="button">message</a>
    `
document.querySelector("#MYO-app").before(el)
    // Your code here...
    el.querySelector('a').onclick = function (e) {
        //e.preventDefault();
        console.log('hi there');
        let orderid = document.querySelector("#MYO-app span[data-test-id=order-id-value]").innerText;
        window.open(`https://sellercentral.amazon.com/messaging/inbox?fi=SEARCH&bt=&nt=&pn=1&pd=NONE&sd=&ed=&si=${orderid}`);
    }

})();