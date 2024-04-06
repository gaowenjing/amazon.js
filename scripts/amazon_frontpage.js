//global
const sleep = ms => new Promise(res => setTimeout(res, ms));

const getpsttime = () => {
    let today = new Date()
    let offset = 8
    today.setUTCHours(today.getUTCHours() - offset)
    return today
}

const msglog = msg => {
    let t = new Date()
    let oldmsg = document.querySelector('#msgboard').innerHTML
    if (localStorage.msglog == 1) {
        document.querySelector('#msgboard').innerHTML = t.toISOString() + ': ' + msg + '<br>' + oldmsg
    }
}
{
    const el = document.createElement('div')
    document.body.append(el)
    let msglogstatus = localStorage.msglog
    el.innerHTML = `
<div id="msgboardcontainer">
<button>msglog ${msglogstatus}</button>
<div id="msgboard"></div>
</div>
<style>
#msgboard {
background-color: grey;
overflow-y: scroll;
}
#msgboardcontainer{
width: 100%;
max-height: 200px;
position: fixed;
bottom: 0px;
}
</style>
`
    el.querySelector('button').onclick = function () {
        localStorage.msglog = localStorage.msglog == 1 ? 0 : 1;
        this.innerHTML = `msglog ${localStorage.msglog}`
    }
}

// nav
// <a target="_blank" href="https://${location.host}/business-reports/ref=xx_sitemetric_dnav_xx">business-report</a>
// <a target="_blank" href="https://${location.host}/reportcentral/ref=xx_fbareports_dnav_xx">reportcentral</a>
{
    const el = document.createElement('div')
    document.body.prepend(el)
    el.innerHTML = `<div id="frontpagelink"><a target="_blank" href="https://${location.host}/sspa/tresah/ref=xx_perftime_dnav_xx">ad report</a>
    <a target="_blank" rel="noreferrer" href="https://${location.host}/merchandising-new/?merchandisingType=BEST_DEAL%2cLIGHTNING_DEAL&selectedStatusFilters=running%2cended&pageNumber=1&pageSize=50&sortColumn=END_DATE&sortOrder=DESC#default">deal list</a>
    <a target="_blank" rel="noreferrer" href="https://${location.host}/feedback-manager/index.html#/">feedback</a>
    <a target="_blank" rel="noreferrer" href="https://${location.host}/brand-customer-reviews/ref=xx_crvws_dnav_xx?includeDone=true">reviews</a>
    <a target="_blank" rel="noreferrer" href="https://${location.host}/payments/reports/custom/request?ref_=xx_report_ttab_dash">date range report</a>
    <a target="_blank" rel="noreferrer" href="https://${location.host}/payments/reports-repository">new date range report</a>
    <button id="openalllink">open all</button>
    <label>goto order: <input name="orderid"></label><button id="gotoorder">go</button>
    <label>goto asin: <input name="gotoasin"></label><button id="gotoasin">go</button>
    <div id="performance"></div></div>
    `
    el.querySelector('#openalllink').onclick = function () {
        document.querySelectorAll('#frontpagelink > a').forEach(
            function (e) {
                e.click()
            }
        )
    }

    el.querySelector('input[name=orderid]').onclick = function () {
        this.value = ''
    }

    el.querySelector('#gotoorder').onclick = function () {
        let orderid = el.querySelector('input[name=orderid]').value
        window.open(`https://${location.host}/orders-v3/order/${orderid}`)
    }

    el.querySelector('#gotoasin').onclick = function () {
        let asin = el.querySelector('input[name=gotoasin]').value
        window.open(`https://amazon.com/dp/${asin}`)
    }

    const performanceurl = `https://${location.host}/performance/api/notification?pageSize=25&pageNumber=1&sortBy=NewestToOldest&filterBy=Any`
    const queryperformance = () => {
        fetch(performanceurl).then(res => res.json())
            .then(data => {
                let pn = data.list
                let html = ''
                let today = new Date()
                let period = 5
                let daysbefore = new Date(today.getFullYear(), today.getMonth(), today.getDate() - period).getTime()
                let d = ''
                let count = 0
                for (let i in pn) {
                    if (pn[i].content.created > daysbefore) {
                        count++
                        d = new Date(pn[i].content.created).toISOString()
                        html += `<a rel="noreferrer" target="_blank" href="/performance/notifications/${pn[i].id}">${pn[i].content.subject} ${d}</a><br>`
                    }
                }
                html = `last update: ${new Date().toLocaleString()} timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone} UTC ${0 - new Date().getTimezoneOffset() / 60}, there are ${count} performance notification in ${period} days:<br>${html}`
                document.querySelector('#performance').innerHTML = html
            }).catch(e => msglog(e))
    }
    queryperformance()
    setInterval(() => queryperformance(),
        1000 * 60 * 6 //6 hours
    )
}

// business report upload
{
    const serverhost = 'https://gz.dyip.cn:8443/'
    const uploaddata = async (pdata, reqDate) => {
        fetch(serverhost + 'br', {
            method: 'POST',
            headers: {},
            cors: 'no-cors',
            body: pdata,
        }).then(res => res.json())
            .then(data => msglog(`${reqDate} upload success<br>`))
            .catch(err => msglog(`upload error, msg:${err}<br>`))
    }

    const getsellerinfo = () => {
        // data-merchant_selection="amzn1.merchant.o.xxxxxxxxxxx"
        return document.querySelector('#partner-switcher').getAttribute('data-merchant_selection')
    }

    const checkdate = async (reqDate) => {
        let sellerid = getsellerinfo();
        bodydata = JSON.stringify({
            sellerid: sellerid,
            reqdate: reqDate
        });
        return fetch(serverhost + 'brstat', {
            'method': 'post',
            'body': bodydata,
            'cors': 'no-cors',
        }).then(res => res.json())
            .catch(err => msglog(`checkdate error, msg ${err}`))
    }

    //include uploaddata()
    const getdata = async (reqDate) => {
        let reqstat = await checkdate(reqDate)
        if (reqstat[0].records > 0) {
            msglog(`${reqDate} record has ${reqstat[0].records} records<br>`)
            return 'record existed'
        }
        // format '2021-08-25'
        var jdata = JSON.parse("{\"operationName\":\"reportDataQuery\",\"variables\":{\"input\":{\"legacyReportId\":\"102:DetailSalesTrafficByChildItem\",\"startDate\":\"2021-08-25\",\"endDate\":\"2021-08-27\"}},\"query\":\"query reportDataQuery($input: GetReportDataInput) {\\n  getReportData(input: $input) {\\n    granularity\\n    hadPrevious\\n    hasNext\\n    size\\n    startDate\\n    endDate\\n    page\\n    columns {\\n      label\\n      valueFormat\\n      isGraphable\\n      translationKey\\n      isDefaultSortAscending\\n      isDefaultGraphed\\n      isDefaultSelected\\n      isDefaultSortColumn\\n      __typename\\n    }\\n    rows\\n    __typename\\n  }\\n}\\n\"}")
        // jdata.variables.input.startDate = '2021-08-25'
        // jdata.variables.input.endDate = '2021-08-25'
        jdata.variables.input.startDate = reqDate
        jdata.variables.input.endDate = reqDate
        let reqpayload = JSON.stringify(jdata)
        fetch(`https://${location.host}/business-reports/api`, {
            "headers": {
                "accept": "*/*",
                // "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "content-type": "application/json",
            },
            // "referrer": `https://${location.host}/business-reports?mons_sel_locale=en_US`,
            "body": reqpayload,
            "method": "POST",
            'mode': 'cors',
            "credentials": "include"
        }).then(res => res.json())
            .then(jd => {
                jd.sellerid = getsellerinfo();
                msglog(`${reqDate} get data sucessfully, rows ${jd.data.getReportData.size}<br>`)
                uploaddata(JSON.stringify(jd), reqDate)
            })
            .catch(err => {
                msglog(`getdata error, msg:${err}<br>`)
            })
    }

    const getalldata = async (reportdays) => {
        let count = reportdays
        let brmsg = document.querySelector('div#brmsg')
        let d = getpsttime()
        d.setUTCDate(d.getUTCDate() - 1)
        for (let i = 0; i < count; i++) {
            reqDate = d.toISOString().split('T')[0] // UTC
            brmsg.innerHTML = `current working on:${reqDate} ${count - i} left`
            await getdata(reqDate)
            await sleep(500)
            d.setUTCDate(d.getUTCDate() - 1)
        }
    }

    const el = document.createElement('div')
    el.style.backgroundColor = 'grey'
    el.style.position = 'fixed'
    el.style.right = '10%'
    el.style.bottom = '10%'
    el.style.zIndex = 100

    el.innerHTML = `
<span>business report uploader</span><span class="close-button">[x]</span><br>
<input name="count" value="3">
<input type="submit" value="start">
<input type="button" name="autostart" value="auto">
<input type="checkbox" name="autocheck">
<div id="brmsg"></div>
`
    document.body.prepend(el)
    el.querySelector('.close-button').onclick = () => {
        el.style.display = 'none'
    }

    el.querySelector('input[value="auto"]').onclick = function () {
        this.disabled = true
        count = el.querySelector('input[name=count]').value;
        getalldata(count)
        timer = setInterval(
            async () => {
                await getalldata(count)
            },
            // 12 hours update
            1000 * 60 * 60 * 12
        )
    }
    el.querySelector('input[name="autocheck"]').checked = localStorage.brautoupload == "1" ? 1 : 0;
    el.querySelector('input[name="autostart"]').disabled = localStorage.brautoupload == "0"
    el.querySelector('input[name="autocheck"]').onclick = function () {
        localStorage.brautoupload = this.checked ? 1 : 0;
        el.querySelector('input[name="autostart"]').disabled = !this.checked
    }

    el.querySelector('input[type=submit]').onclick = function () {
        this.disabled = true
        count = el.querySelector('input[name=count]').value;
        (async () => {
            await getalldata(count)
            this.disabled = false
        })()
    }

    el.querySelector('input[name=count]').onclick = function () {
        el.querySelector('input[type=submit]').disabled = false
    }
    if (localStorage.brautoupload == "1") {
        window.onload = function () {
            setTimeout(() =>
                el.querySelector('input[name="autostart"]').click(),
                1000 * 5
            )
        }
    }
}

// auto upload report
// reports -> sales -> all orders // id 2400
{
    const getreportId = (reportsubmitId) => {
        let d = getpsttime()
        // for fulfillment report dateformat '2021/09/01' 'yyyy/mm/dd'
        let rpenddate = d.getUTCFullYear() + '/' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '/' + ('0' + d.getUTCDate()).slice(-2)
        // 7 days before
        d.setUTCDate(d.getUTCDate() - 7)
        let rpstartdate = d.getUTCFullYear() + '/' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '/' + ('0' + d.getUTCDate()).slice(-2)

        let url = `https://${location.host}/reportcentral/api/v1/submitDownloadReport?reportFileFormat=TSV&&reportStartDate=${encodeURIComponent(rpstartdate)}&reportEndDate=${encodeURIComponent(rpenddate)}&xdaysBeforeUntilToday=-1&startDateTimeOffset=0&endDateTimeOffset=0&specialDateOptions=&reportFRPId=${reportsubmitId}&language=&disableTimezone=true`
        msglog(`rpstartdate: ${rpstartdate}; rpenddate: ${rpenddate}`)

        return fetch(url, {
            'method': 'POST'
        }).then(res => res.json())
            .then(data => data.reportReferenceId)
            .catch(
                () => {
                    document.querySelector('#msgpanel').innerText = 'error may need to reload'
                    document.querySelector('#msgpanel').style.color = 'red'
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
                // "referrer": "https://sellercentral.amazon.com/reportcentral/FlatFileAllOrdersReport/1",
                // "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                // "mode": "cors",
                "credentials": "include"
            }).then(res => res.json()).then(data => data[0])
    }

    const fbtndownload = async function () {
        // reports -> sales -> all orders // id 2400
        var reportId = await getreportId('2400')
        var msgpanel = document.querySelector('#msgpanel')
        var timer = setInterval(async () => {
            let s = await checkreportstatus(reportId)
            if (s == 'Done') {
                downloadandupload(reportId)
                clearInterval(timer);
                msgpanel.innerHTML = s
            } else if (s == 'Cancelled') {
                clearInterval(timer);
                msgpanel.innerHTML = s
            } else {
                msgpanel.innerHTML = s
            }
        }, 5000)
    }

    const downloadandupload = async (reportId) => {
        var downloadurl = `https://${location.host}/reportcentral/api/v1/downloadFile?referenceId=${reportId}&fileFormat=TSV`
        fetch(downloadurl).then(res => res.blob())
            .then(
                blob => {
                    var fd = new FormData()
                    fd.append('fileToUpload', blob, reportId + '.txt')
                    fd.append('store', localStorage.sellerstore)
                    // upload here
                    fetch(localStorage.uploadurl, {
                        'method': 'post',
                        'body': fd
                    }).then(res => res.text())
                        .then(text => document.querySelector('div#msgpanel').innerHTML = `上次更新时间: ${new Date().toLocaleDateString()}`)
                }
            )
    }

    // inject element to page
    const el = document.createElement('div');
    el.classList.add('reportdownloader')
    el.style.backgroundColor = 'grey'
    el.innerHTML = `
<div>自动更新订单号，不要关闭页面</div><span class="close-button">[x]</span><br>
<label><input name="uploadurl" placeholder="https://the_url_upload_to/" value="${localStorage.uploadurl ? localStorage.uploadurl : ''}"></label><br>
<label><input name="sellerstore" placeholder="the storeid upload to" value="${localStorage.sellerstore ? localStorage.sellerstore : ''}"></label><br>
<button id="startprocess">start</button><br>
<div id="msgpanel"></div>
`
    //https://sellercentral.amazon.com/reportcentral/api/v1/submitDownloadReport?reportFileFormat=TSV&&reportStartDate=2021%2F09%2F01&reportEndDate=2021%2F09%2F30&xdaysBeforeUntilToday=-1&startDateTimeOffset=0&endDateTimeOffset=0&specialDateOptions=&reportFRPId=2673&language=&disableTimezone=true

    el.style.position = 'fixed'
    el.style.left = '10%'
    el.style.bottom = '10%'
    el.style.zIndex = 100
    document.body.prepend(el)
    el.querySelector('#startprocess').onclick = function () {
        localStorage.uploadurl = el.querySelector('input[name=uploadurl]').value
        localStorage.sellerstore = el.querySelector('input[name=sellerstore]').value
        this.disabled = true
        fbtndownload()
        var timer = setInterval(
            fbtndownload,
            // 12hrs update once
            1000 * 60 * 60 * 12
        )
    }
    el.querySelector('.close-button').onclick = function () {
        el.style.display = 'none'
    }

}

// report download
{
    // reports -> sales -> all orders // id 2400
    // reports -> paymens -> reimbursements // id 2617
    // reports -> paymens -> monthly storage fees// id 2673
    // reports -> customer concessions -> replacements // id 2602
    // reports -> customer concessions -> FBA customer returns // id 2610

    const getreportId = (reportsubmitId) => {
        // for fulfillment report dateformat '2021/09/01' 'yyyy/mm/dd'
        let psttime = getpsttime()

        let selectedmonth = document.querySelector('input[name=whatmonth]:checked').value
        if (selectedmonth == 'lastmonth') {
            psttime.setUTCDate(0)
        } else if (selectedmonth == 'thismonth') {
            // psttime.setUTCDate(psttime.getUTCDate() - 1)
        }
        console.log(psttime)

        if (selectedmonth == 'custom') {
            // custom
            let custom = new Date(document.querySelector('input[name=custommonth]').value)
            custom.setMonth(custom.getMonth() + 1)
            custom.setDate(0)
            rpstartdate = custom.getFullYear() + '/' + ('0' + (custom.getMonth() + 1)).slice(-2) + '/01'
            rpenddate = custom.toISOString().split('T')[0].replaceAll('-', '/')
        } else {
            rpstartdate = psttime.getUTCFullYear() + '/' + ('0' + (psttime.getUTCMonth() + 1)).slice(-2) + '/01'
            rpenddate = psttime.getUTCFullYear() + '/' + ('0' + (psttime.getUTCMonth() + 1)).slice(-2) + '/' + ('0' + psttime.getUTCDate()).slice(-2)
        }

        let url = `https://${location.host}/reportcentral/api/v1/submitDownloadReport?reportFileFormat=TSV&&reportStartDate=${encodeURIComponent(rpstartdate)}&reportEndDate=${encodeURIComponent(rpenddate)}&xdaysBeforeUntilToday=-1&startDateTimeOffset=0&endDateTimeOffset=0&specialDateOptions=&reportFRPId=${reportsubmitId}&language=&disableTimezone=true`
        msglog(`startdate: ${rpstartdate}; enddate: ${rpenddate}; reportsubmitId: ${reportsubmitId}`)

        return fetch(url, {
            'method': 'POST'
        }).then(res => res.json())
            .then(data => data.reportReferenceId)
            .catch(
                err => {
                    msglog(err)
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
    const version = '20220702.2'
    const offset = 8 //pst offset to utc
    // turn utc to pst
    let lm = getpsttime()
    let tm = getpsttime()
    lm.setUTCDate(0)
    // tm.setUTCDate(tm.getUTCDate() - 1)
    let lms = lm.toISOString().split('T')[0].replace(/-[0-9]{2}$/, '')
    let tms = tm.toISOString().split('T')[0].replace(/-[0-9]{2}$/, '')
    el.innerHTML = `
<style>
div.reportdownloader {
    background-color: grey;
}
input[name="custommonth"] {
    max-width: 100px;
}
</style>
<span>monthly report (PST) </span><span class="close-button">[x]</span><br>ver: ${version}<br>
<label>lastmonth<input type="radio" name="whatmonth" value="lastmonth"></label>${lms}<br>
<label>thismonth<input type="radio" name="whatmonth" value="thismonth" checked></label>${tms}<br>
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
    el.style.top = '10%'
    el.style.zIndex = 1000
    document.body.prepend(el)
    document.querySelectorAll('div.reportdownloader button[data-reportsubmitid]').forEach(
        (e, i) => {
            e.onclick = fbtndownload
        }
    );
    el.querySelector('.close-button').onclick = function () {
        el.style.display = 'none'
    }

    // payment date range report
    const csrftoken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const submitreport = async () => {
        let rpstartdate, rpstartmonth, rpstartyear, rpenddate, rpendmonth, rpendyear
        let rpdatetime = getpsttime()

        if (document.querySelector('input[name=whatmonth]:checked').value == 'lastmonth') {
            rpdatetime.setUTCDate(0) // set to lastmonth
        } else {
            rpdatetime.setUTCDate(rpdatetime.getUTCDate() - 1) // expect current day
        }
        rpstartdate = '1'
        rpenddate = rpdatetime.getUTCDate()
        rpstartmonth = rpdatetime.getUTCMonth() + 1
        rpendmonth = rpdatetime.getUTCMonth() + 1
        rpstartyear = rpdatetime.getUTCFullYear()
        rpendyear = rpdatetime.getUTCFullYear()

        await fetch(`https://${location.host}/payments/reports/custom/submit/generateReports`, {
            "headers": {
                "accept": "*/*",
                "content-type": "application/json",
                "anti-csrftoken-a2z": csrftoken,
                "x-requested-with": "XMLHttpRequest"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `{"reportType":"Transaction","timeRangeType":"Custom","selectedAccountTypeDropdownValue":"All","startDate":{"date":${rpstartdate},"month":${rpstartmonth},"year":${rpstartyear}},"endDate":{"date":${rpenddate},"month":${rpendmonth},"year":${rpendyear}}}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(res => res.text())
            .then(text => msglog(text))
            .catch(
                err => {
                    msglog(err)
                }
            )
    }

    // payment date range report status
    const refreshstatus = async () => {
        return await fetch(`https://${location.host}/payments/reports/custom/request/refresh/ref=bb_tabela_cont_tabela`, {
            "headers": {
                "accept": "text/html, */*; q=0.01",
                "anti-csrftoken-a2z": csrftoken,
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
        try {
            await submitreport()
        } catch (error) {
            msglog(error)
        }
        for (let i = 0; i < 50; i++) {
            let status = await refreshstatus()
            await sleep(3000)
            if (status.innerText.match('Progress\|进行中'))
                msglog('in progress...')
            if (status.innerText.match('Download\|下载')) {
                msglog('downloadable')
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
}
