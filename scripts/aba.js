const sleep = async ms => new Promise(res => setTimeout(res, ms))

// DAILY WEELKY MONTHLY
function setrangetype(rangetype) {
    if (document.querySelector('#dashboard-filter-reportingRange button').getAttribute('aria-expanded') == 'true') {
        document.querySelector(`#dashboard-filter-reportingRange li[data-testid="${rangetype}"]`).click()
    } else {
        document.querySelector('#dashboard-filter-reportingRange button').click()
    }
}
// setrangetype('MONTHLY')
function setrange(rangestartdate) {
    document.querySelector("#dashboard-filter-periodPicker input").click()
}
window.addEventListener('beforeunload', function (event) {
    event.stopImmediatePropagation();
});
async function startdownload() {
    document.querySelector("#downloadButton button").click()
    await sleep(500)
    document.querySelector("#downloadButton > awsui-button-dropdown li[data-testid=searchTermsDetail_csv]").click()
    let warning = document.querySelector("div.i90-modal-body.i90-report-download-warning > div.i90-report-download-warning-button-div > button.i90-report-download-warning-primary-button-div")
    if (warning) {
        warning.click()
    }
    let process = document.querySelector("#downloadButton > awsui-button-dropdown > div > awsui-button > button > span")
}

// startdownload()
// setrange()

const el = document.createElement('div')
document.body.prepend(el)
el.innerHTML = `
<button id="aba_download">start download</button>
`

document.querySelector('#aba_download').onclick = () => {
    startdownload()
}