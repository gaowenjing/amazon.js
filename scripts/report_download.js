const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// reports -> sales -> all orders // id 2400
// reports -> paymens -> reimbursements // id 2617
// reports -> paymens -> monthly storage fees// id 2673
// reports -> customer concessions -> replacements // id 2602
// reports -> customer concessions -> FBA customer returns // id 2610

const getreportId = (reportsubmitId) => {
    let d = new Date()
    // for fulfillment report dateformat '2021/09/01' 'yyyy/mm/dd'
    // thismonth
    let thismonthstartdate = d.getFullYear() + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/01'
    let thismonthenddate = d.getFullYear() + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getDate()

    // lastmonth
    let lastmonth = new Date()
    lastmonth.setDate(0)
    let lastmonthstartdate = lastmonth.getFullYear() + '/' + ('0' + (lastmonth.getMonth() + 1)).slice(-2) + '/01'
    let lastmonthenddate = lastmonth.getFullYear() + '/' + ('0' + (lastmonth.getMonth() + 1)).slice(-2) + '/' + lastmonth.getDate()

    // custom
    let custom = new Date(document.querySelector('input[name=custommonth]').value)
    custom.setMonth(custom.getMonth() + 1)
    custom.setDate(0)
    let custommonthstartdate = custom.getFullYear() + '/' + ('0' + (custom.getMonth() + 1)).slice(-2) + '/01'
    let custommonthenddate = custom.toISOString().split('T')[0].replaceAll('-', '/')

    if (document.querySelector('input[name=whatmonth]:checked').value == 'lastmonth') {
        rpstartdate = lastmonthstartdate
        rpenddate = lastmonthenddate
    } else if (document.querySelector('input[name=whatmonth]:checked').value == 'custom') {
        rpstartdate = custommonthstartdate
        rpenddate = custommonthenddate
    } else {
        rpstartdate = thismonthstartdate
        rpenddate = thismonthenddate
    }
    let url = `https://${location.host}/reportcentral/api/v1/submitDownloadReport?reportFileFormat=TSV&&reportStartDate=${encodeURIComponent(rpstartdate)}&reportEndDate=${encodeURIComponent(rpenddate)}&xdaysBeforeUntilToday=-1&startDateTimeOffset=0&endDateTimeOffset=0&specialDateOptions=&reportFRPId=${reportsubmitId}&language=&disableTimezone=true`

    return fetch(url, {
        'method': 'POST'
    }).then(res => res.json())
        .then(data => data.reportReferenceId)
        .catch(
            () => {
                document.querySelector('div.reportdownloader button').innerText = 'error may need to reload'
                document.querySelector('div.reportdownloader button').style.color = 'red'
                setTimeout(() =>
                    location.reload(),
                    3000
                )
            }
        )
}

//{"reportReferenceId":"50533018888","reportStatus":"InProgress","reportRequestDateTime":"2021/09/17 20:46:23","reportStartDateTime":"2021/09/01 00:00:00","reportEndDateTime":"2021/09/18 23:59:59","reportFormat":"TSV","reportId":2400}
const checkreportstatus = (reportId) => {
    let url = `https://${location.host}/reportcentral/api/v1/getDownloadReportStatus?referenceIds=${reportId}`
    return fetch(url,
        {
            "headers": {
                "accept": "*/*",
            },
            "referrer": `https://${location.host}/reportcentral/FlatFileAllOrdersReport/1`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res => res.json()).then(data => data[0])
}

const fbtndownload = async function () {
    this.disabled = true
    var reportId = await getreportId(this.dataset.reportsubmitid)
    var downloadurl = `https://${location.host}/reportcentral/api/v1/downloadFile?referenceId=${reportId}&fileFormat=TSV`
    var timer = setInterval(async () => {
        let s = await checkreportstatus(reportId)
        if (s == 'Done') {
            location.href = downloadurl
            clearInterval(timer);
            this.disabled = false
            this.innerText = s
        } else if (s == 'Cancelled') {
            clearInterval(timer);
            this.disabled = false
            this.innerText = s
        } else {
            this.innerText = s
        }
    }, 5000)
}

// inject element to page
const el = document.createElement('div');
el.classList.add('reportdownloader')
// el.style.backgroundColor = 'grey'
el.innerHTML = `
<style>
div.reportdownloader {
    background-color: grey;
}
input[name="custommonth"] {
    max-width: 100px;
}
</style>
<span>monthly report downloader</span><br>
<label>lastmonth<input type="radio" name="whatmonth" value="lastmonth"></label><br>
<label>thismonth<input type="radio" name="whatmonth" value="thismonth" checked></label><br>
<label>custom<input type="radio" name="whatmonth" value="custom"></label><input type="text" name="custommonth" placeholder="2021-09" value="2021-09" disabled><br>
fulfillment:<button data-reportsubmitid="2400">get</button>
<br>
reimbursement:<button data-reportsubmitid="2617">get</button>
<br>
return:<button data-reportsubmitid="2610">get</button>
<br>
replacement:<button data-reportsubmitid="2602">get</button>
<br>
monthly storage fee:<button data-reportsubmitid="2673">get</button>
<br>
transaction:<button class="transaction">get</button>
`
//https://sellercentral.amazon.com/reportcentral/api/v1/submitDownloadReport?reportFileFormat=TSV&&reportStartDate=2021%2F09%2F01&reportEndDate=2021%2F09%2F30&xdaysBeforeUntilToday=-1&startDateTimeOffset=0&endDateTimeOffset=0&specialDateOptions=&reportFRPId=2673&language=&disableTimezone=true

el.style.position = 'fixed'
el.style.right = '10%'
el.style.bottom = '10%'
el.style.zIndex = 100
document.body.prepend(el)
document.querySelectorAll('div.reportdownloader button[data-reportsubmitid]').forEach(
    (e, i) => {
        e.onclick = fbtndownload
    }
);

// payment date range report
const submitreport = async () => {
    let today = new Date()
    let thismonthenddate = today.getUTCDate() - 2
    let thismonthyear = today.getFullYear()
    let thismonth = today.getMonth() + 1

    let lastmonthdate = new Date()
    lastmonthdate.setDate(0)
    let lastmonthenddate = lastmonthdate.getDate()
    let lastmonth = lastmonthdate.getMonth() + 1
    let lastmonthyear = lastmonthdate.getFullYear()

    let rpstartdate, rpstartmonth, rpstartyear, rpenddate, rpendmonth, rpendyear

    if (document.querySelector('input[name=whatmonth]:checked').value == 'lastmonth') {
        rpstartdate = '1'
        rpstartmonth = lastmonth
        rpstartyear = lastmonthyear
        rpenddate = lastmonthenddate
        rpendmonth = lastmonth
        rpendyear = lastmonthyear
    } else {
        rpstartdate = '1'
        rpstartmonth = thismonth
        rpstartyear = thismonthyear
        rpenddate = thismonthenddate
        rpendmonth = thismonth
        rpendyear = thismonthyear
    }

    await fetch(`https://${location.host}/payments/reports/custom/submit/generateReports`, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{"reportType":"Transaction","timeRangeType":"Custom","selectedAccountTypeDropdownValue":"All","startDate":{"date":${rpstartdate},"month":${rpstartmonth},"year":${rpstartyear}},"endDate":{"date":${rpenddate},"month":${rpendmonth},"year":${rpendyear}}}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.text())
        .then(text => console.log(text))
}

// payment date range report status
const refreshstatus = async () => {
    return await fetch(`https://${location.host}/payments/reports/custom/request/refresh/ref=bb_tabela_cont_tabela`, {
        "headers": {
            "accept": "text/html, */*; q=0.01",
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{"action":"CUSTOM_REFRESH","pageNumber":1,"recordsPerPage":10,"sortOrder":"DESCENDING","tableId":"daterangereportstable","filters":[],"clientState":{}}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.text()) //note return html
        .then(text => new window.DOMParser().parseFromString(text, "text/html"))
        .then(xml => new window.DOMParser().parseFromString('<table>' + xml.querySelector('#itemRecords script').innerText + '</table>', "text/html"))
        .then(html => html.querySelector('td[data-column=ddrAction]'));
}

document.querySelector('div.reportdownloader button.transaction').onclick = async function () {
    this.disabled = true
    await submitreport()
    for (let i = 0; i < 50; i++) {
        let status = await refreshstatus()
        await sleep(1000)
        if (status.innerText.match('Progress\|进行中'))
            console.log('in progress...')
        if (status.innerText.match('Download\|下载')) {
            console.log('downloadable')
            location.href = status.querySelector('a').href
            break
        }
    }
    this.disabled = false
}

el.querySelectorAll('input[name=whatmonth]').forEach(
    e => {
        e.onclick = function () {
            if (e.value == 'custom') {
                el.querySelector('input[name=custommonth]').disabled = false
                el.querySelector('input[name=custommonth]').focus()
            } else {
                el.querySelector('input[name=custommonth]').disabled = true
            }
        }
    }
)