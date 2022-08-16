const el = document.createElement('div')
version = '20220628.5'
el.innerHTML = `
<label>entity id<input name="adId" placeholder="entityId"></label>
<br>
<label>lock config<input type="checkbox" checked name="lockconfig"></label>${version}
<hr>
<div id="reportids">
<div id="thismonthgroup">
<label id="thismonthgrouplabel"><input type="checkbox" class="groupcheckbox">this month</label>
<br>
<div class="monthgroupmember">
<label><input type="checkbox">sp report </label><input type="text" name="thismonthspId">
<br>
<label><input type="checkbox">sd report </label><input type="text" name="thismonthsdId">
<br>
<label><input type="checkbox">sbv report </label><input type="text" name="thismonthsbvId">
<br>
</div>
</div>
<hr>
<div id="lastmonthgroup">
<label id="lastmonthgrouplabel"><input type="checkbox" class="groupcheckbox">last month</label>
<br>
<div class="monthgroupmember">
<label><input type="checkbox">sp report </label><input type="text" name="lastmonthspId">
<br>
<label><input type="checkbox">sd report </label><input type="text" name="lastmonthsdId">
<br>
<label><input type="checkbox">sbv report </label><input type="text" name="lastmontsbvId">
<br>
</div>
</div>
</div>
<button>request report</button>
<div id="globalreportmsg"></div>
<style>
#reportids label {
    display: inline;
}
#reportids input {
    max-width: 100px;
    display: inline;
}
</style>
`
el.style.padding = '10px'
el.style.maxWidth = '300px'
el.style.position = 'fixed'
el.style.bottom = '10%'
el.style.right = '10%'
el.style.backgroundColor = 'rgb(220,220,220, 0.9)'
el.style.zIndex = 100
document.body.prepend(el)

el.querySelectorAll('input[type=checkbox]').forEach(
    e => e.onclick = function () {
        savereportconfig()
    }
)

el.querySelector('input[name=lockconfig]').onclick = function () {
    el.querySelectorAll('#reportids input[type=text]').forEach(
        e => e.disabled = this.checked
    )
}
el.querySelectorAll('#reportids input[type=text]').forEach(
    e => e.disabled = el.querySelector('input[name=lockconfig]').checked
)

//group checkbox
el.querySelectorAll('.groupcheckbox').forEach(
    e => e.onclick = function () {
        this.parentElement.parentElement.querySelectorAll('input[type=checkbox]').forEach(
            e => e.checked = this.checked
        )
    }
)

document.querySelector('input[name=adId]').onclick = function () {
    let p = new URLSearchParams(location.search)
    document.querySelector('input[name=adId]').value = p.get('entityId')
    localStorage.adId = document.querySelector('input[name=adId]').value
}

// auto read report id from url
document.querySelectorAll('#reportids input[type=text]').forEach(
    e => {
        e.onclick = function () {
            this.value = location.pathname.replace(/.*\//, '')
            savereportconfig()
        }
    }
)

if (typeof localStorage.adId != 'undefined') {
    document.querySelector('input[name=adId]').value = localStorage.adId
}

const restorereportconfig = () => {
    if (typeof localStorage.reportconfig == 'undefined') return false;
    const saveconfig = localStorage.reportconfig
    const saveconfigparsed = JSON.parse(saveconfig)
    document.querySelectorAll('#reportids input').forEach(
        e => {
            if (e.type == 'text') {
                e.value = saveconfigparsed[e.name].value
                e.previousElementSibling.firstChild.checked = saveconfigparsed[e.name].checkbox
            }
        }
    )
}

restorereportconfig()

const savereportconfig = () => {
    const saveconfig = {}
    document.querySelectorAll('#reportids input').forEach(
        e => {
            if (e.type == 'text') {
                saveconfig[e.name] = {
                    checkbox: e.previousSibling.firstChild.checked,
                    value: e.value
                }
            }
        }
    )
    localStorage.reportconfig = JSON.stringify(saveconfig)
}

el.querySelector('button').onclick = function () {
    this.disabled = true
    savereportconfig();

    document.querySelectorAll('.monthgroupmember input[type=checkbox]').forEach(
        e => {
            if (e.checked) {
                // console.log(e.parentElement.nextElementSibling)
                downloadadreport(e.parentElement.nextSibling)
            }
        }
    )
    this.disabled = false
}

const downloadadreport = async (reportIdtag) => {
    let reportId = reportIdtag.value
    let reportmsg = document.createElement('span')
    reportIdtag.after(reportmsg)
    const adId = document.querySelector('input[name=adId]').value
    try {
        //let downloadurl = await runreport(adId, reportId);
        let downloadurl = await runreport2(adId, reportId);
        let timer = setInterval(async () => {
            if (downloadurl = await checkreportstatus(adId, reportId)) {
                // location.href = downloadurl
                window.open(downloadurl)
                clearInterval(timer)
                reportmsg.innerHTML = `done`
            } else {
                reportmsg.innerHTML = `waiting`
            }
        }, 3000)
    } catch (error) {
        document.querySelector('#globalreportmsg').innerHTML = error
    }
}

// response
// {
//     "name": "Sponsored Display Advertised product report",
//     "description": "Subscription for 60823158802",
//     "reportId": "24c0c9da-e9a5-318d-cc5f-87caf7069786",
//     "subscriptionId": "8588f51a-e74d-4178-86e7-c3fc83d36c58",
//     "reportStatus": "Pending",
//     "reportType": "Carbyne",
//     "s3location": null,
//     "created": 1656040575818,
//     "publishers": [
//         "email: nobody@amazon.com"
//     ]
// }
const runreport2 = (adId, reportId) => {
    return fetch(`https://${location.host}/reports/api/subscriptions/${reportId}/report?entityId=${adId}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "anti-csrftoken-a2z": document.querySelector('input[name="csrf-token"]').value,
            "content-type": "application/json",
        },
        "referrer": `https://advertising.amazon.com/reports/history/${reportId}?entityId=${adId}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json()).then(data => data.reportId)
}

const runreport = (adId, reportId) => {
    return fetch(`https://${location.host}/sspa/tresah/run-subscription?entityId=${adId}`, {
        "headers": {
            "content-type": "application/json",
        },
        "body": `{"subscriptionId":"${reportId}","programType":"sp"}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json()).then(data => `https://${location.host}/sspa/tresah/download?id=${data.reportId}&ref_=AAC_gnav_reports&entityId=${adId}`
    )
}

//https://advertising.amazon.com/sspa/tresah/download?id=4ebe058a-753f-a802-e371-73ad8b230071&ref_=AAC_gnav_reports&entityId=ENTITY12D4VCP59ZTWA
//https://advertising.amazon.com/reports/api/subscription-reports/8588f51a-e74d-4178-86e7-c3fc83d36c58?entityId=ENTITY12D4VCP59ZTWA
const checkreportstatus = (adId, reportId) => {
    //return fetch(`https://${location.host}/sspa/tresah/reports?entityId=${adId}`, {
    const csrftoken = document.querySelector('input[name="csrf-token"]').value
    console.log(csrftoken)
    return fetch(`https://${location.host}/reports/api/subscription-reports/${reportId}?entityId=${adId}`, {
        "headers": {
            "content-type": "application/json",
            "anti-csrftoken-a2z": csrftoken,
        },
        "body": `{"filters":[{"column_name":"REPORT_SUBSCRIPTION_ID","filter_type":"EQUAL","values":["${reportId}"]}],"sort":{"columnName":"REPORT_CREATED_ON","order":"DESC"},"pagination":{"pageLimit":50}}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json())
        // .then(data => data.reports[0].completed)
        .then(data => data.reports[0].s3location)
}

// add link here
document.querySelectorAll('.monthgroupmember').forEach(
    e => {
        console.log(e)
        e.querySelectorAll('input[type=text]').forEach(
            g => {
                //https://advertising.amazon.com/reports/history/6c104256-d095-45a9-828d-5ef4ca703f3f?entityId=ENTITY2NSAXF1G4Z78N
                let atag = document.createElement('span')
                let adId = document.querySelector('input[name=adId]').value
                atag.innerHTML = `<a target="_blank" href=https://advertising.amazon.com/reports/history/${g.value}?entityId=${adId}>link</a>`
                g.after(atag)
                console.log(g, atag)
            }
        )
    }

)