const mid = document.createElement('div')

if (document.querySelector('#login_username')) {
    document.body.prepend(mid)
}

mid.innerHTML = `
<input type="text" name="password" value=${localStorage.savedpassword}>
<input type="text" name="time_to_restart" value=>
<input type="submit" value="schedule to restart">
<button>login</button>
<div></div>
`


var routerurl = 'http://192.168.1.1'
var user = 'useradmin'
var password = '3kn3r'

const logingw = () => {
    fetch("http://192.168.1.1/cgi-bin/luci", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh,en-US;q=0.9,en;q=0.8",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1"
        },
        "referrer": "http://192.168.1.1/cgi-bin/luci",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `username=useradmin&psd=${password}`,
        "method": "POST",
        "mode": "cors",
        //   "credentials": "omit"
    }).then(res => res.text())
        .then(text => {
            var dp = new window.DOMParser()
            var doc = dp.parseFromString(text, 'text/html')
            doc.querySelectorAll('script').forEach((el) => {
                if (el.innerText != '') {
                    let re = /token: '(.*)'/
                    doreboot('token=' + re.exec(el.innerText)[1])
                }
            }
            );
        }
        )
}

const doreboot = (data) => {
    fetch('/cgi-bin/luci/admin/reboot', {
        'method': 'post',
        'body': data,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}

mid.querySelector('button').onclick = function () {
    document.querySelector('input#login_username').value = 'useradmin'
    document.querySelector('input#login_password').value = mid.querySelector('input[name=password]').value
    document.querySelector('button[type=submit]').click()
}

mid.querySelector('input[type=submit]').onclick = function () {
    this.disabled = true
    localStorage.savedpassword = mid.querySelector('input[name=password]').value
    localStorage.needreboot = 'true';
    var timer = setInterval(() => {
        if (new Date().getUTCHours() == 17 && localStorage.needreboot == 'true') {
            logingw()
            localStorage.needreboot = 'false'
            clearInterval(timer)
        } else {
            mid.querySelector('div').innerText = `Timer:${timer} Status: waiting Needreboot: ${localStorage.needreboot} When: in ${17 - new Date().getUTCHours()} hours ${60 - new Date().getUTCMinutes()} mins ${60 - new Date().getUTCSeconds()} seconds(update in 30s)`
        }
    }, 30000)
    mid.querySelector('div').innerText = `Timer:${timer} Status: waiting Needreboot: ${localStorage.needreboot} When: in ${17 - new Date().getUTCHours()} hours ${60 - new Date().getUTCMinutes()} mins ${60 - new Date().getUTCSeconds()} seconds(update in 30s)`
}
