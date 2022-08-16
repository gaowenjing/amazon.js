{
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
        let rpstartdate = thismonthenddate
        let rpenddate = thismonthenddate

        // 7days before
        let day7 = new Date()
        day7.setDate(day7.getDate() - 7)
        let day7before = day7.getFullYear() + '/' + ('0' + (day7.getMonth() + 1)).slice(-2) + '/' + day7.getDate()

        rpstartdate = day7before
        rpenddate = thismonthenddate
        let url = `https://${location.host}/reportcentral/api/v1/submitDownloadReport?reportFileFormat=TSV&&reportStartDate=${encodeURIComponent(rpstartdate)}&reportEndDate=${encodeURIComponent(rpenddate)}&xdaysBeforeUntilToday=-1&startDateTimeOffset=0&endDateTimeOffset=0&specialDateOptions=&reportFRPId=${reportsubmitId}&language=&disableTimezone=true`

        return fetch(url, {
            'method': 'POST'
        }).then(res => res.json())
            .then(data => data.reportReferenceId)
            .catch(
                () => {
                    document.querySelector('#msgpanel').innerText = 'error may need to reload'
                    document.querySelector('#msgpanel').style.color = 'red'
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
                // "referrer": "https://sellercentral.amazon.com/reportcentral/FlatFileAllOrdersReport/1",
                // "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                // "mode": "cors",
                "credentials": "include"
            }).then(res => res.json()).then(data => data[0])
    }

    const fbtndownload = async function () {
        var reportId = await getreportId('2400')
        var msgpanel = document.querySelector('#msgpanel')
        var downloadurl = `https://${location.host}/reportcentral/api/v1/downloadFile?referenceId=${reportId}&fileFormat=TSV`
        var timer = setInterval(async () => {
            let s = await checkreportstatus(reportId)
            if (s == 'Done') {
                // location.href = downloadurl
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
<h5>自动更新订单号，不要关闭页面</h5>
<label><input name="uploadurl" placeholder="https://the_url_upload_to/" value="${localStorage.uploadurl}"></label><br>
<label><input name="sellerstore" placeholder="the nickname of the store upload to" value="${localStorage.sellerstore}"></label><br>
<button id="startprocess">start</button> <button id="closepanel">close</button><br>
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
    el.querySelector('#closepanel').onclick = function () {
        el.style.display = 'none'
    }

}