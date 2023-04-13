const sleep = async ms => new Promise(res => setTimeout(res, ms))

const el = document.createElement('div')
document.body.prepend(el)
el.innerHTML = `
<button id="aba_download">start download</button>
<div id="msgboard"></div>
`
const getfbafee = () => {
    const msgboard = document.querySelector('#msgboard')
    let msg =''
    document.querySelector('kat-table').querySelectorAll('kat-table-row[data-cy]').forEach(
        e => {
            msg += e.innerText.match(/ASIN:\s(\w{10})/)[1] + ' ' + e.innerText.match(/\$\s*(\d+\.\d+)\sFBA Fee/)[1] +'<br>'
        }
    )
    msgboard.innerHTML = msg
}

document.querySelector('#aba_download').onclick = () => {
    getfbafee()
}