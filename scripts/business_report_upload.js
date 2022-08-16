{
    const serverhost = 'https://gz.dyip.cn:8443/'
    const clg = msg => {
        let logelem = document.querySelector('#consolelog')
        logelem.innerHTML = `${msg}` + logelem.innerHTML
    }
    const uploaddata = async (pdata, reqDate) => {
        fetch(serverhost + 'br', {
            method: 'POST',
            headers: {},
            cors: 'no-cors',
            body: pdata,
        }).then(res => res.json())
            .then(data => clg(`${reqDate} upload success<br>`))
            .catch(err => clg(`upload error, msg:${err}<br>`))
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
            .catch(err => clg(`checkdate error, msg ${err}`))
    }

    //include uploaddata()
    const getdata = async (reqDate) => {
        let reqstat = await checkdate(reqDate)
        if (reqstat[0].records > 0) {
            clg(`${reqDate} record has ${reqstat[0].records} records<br>`)
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
            "referrer": `https://${location.host}/business-reports?mons_sel_locale=en_US`,
            "body": reqpayload,
            "method": "POST",
            // 'mode': 'cors'
        }).then(res => res.json())
            .then(jd => {
                jd.sellerid = getsellerinfo();
                clg(`${reqDate} get data sucessfully, rows ${jd.data.getReportData.size}<br>`)
                uploaddata(JSON.stringify(jd), reqDate)
            })
            .catch(err => {
                clg(`getdata error, msg:${err}<br>`)
                location.reload()
            })
    }

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    const getalldata = async (reportdays) => {
        let count = reportdays
        let brmsg = document.querySelector('div#brmsg')
        let d = new Date()
        d.setDate(d.getDate() - 2)
        for (let i = 0; i < count; i++) {
            reqDate = d.toISOString().split('T')[0]
            brmsg.innerHTML = `current working on:${reqDate} ${count - i} left`
            await getdata(reqDate)
            await sleep(500)
            d.setDate(d.getDate() - 1)
        }
    }

    const el = document.createElement('div')
    el.style.backgroundColor = 'grey'
    el.style.position = 'fixed'
    el.style.right = '10%'
    el.style.bottom = '10%'
    el.style.zIndex = 100

    const version = '2021-11-27 09:54:08'
    el.innerHTML = `
<span>version:${version}</span><br>
<input name="count" value="3">
<input type="submit" value="start">
<button>auto</button>
<div id="brmsg"></div>
<div style="max-height: 10em;overflow: hidden;" id="consolelog"></div>
`
    document.body.prepend(el)

    el.querySelector('button').onclick = function () {
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
    el.querySelector('button').click()
}