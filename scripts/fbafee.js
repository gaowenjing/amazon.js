let el = document.createElement('div')

document.body.prepend(el)
el.style.position = 'fixed'
el.style.bottom = '2em'
el.style.right = '2em'
el.style.zIndex = 100
el.innerHTML = `
<button id="aba_download">get fee</button>
<textarea id="msgboard"></textarea>
<div id="debugmsg"></div>
`
document.querySelector('#msgboard').ondblclick = () => {
    let textarea = document.querySelector('#msgboard')
    textarea.select()
    document.execCommand('copy')
}
let getfbafee = () => {
    const msgboard = document.querySelector('#msgboard')
    const debugmsg = document.querySelector('#debugmsg')
    let msg = ''
    document.querySelector('kat-table').querySelectorAll('kat-table-row[data-cy]').forEach(
        e => {
            //console.log(e)
            try {
                msg += e.innerText.match(/ASIN:\s(\w{10})/)[1] + ' ' + e.innerText.match(/\$\s*(\d+\.\d+)\s(FBA Fee|亚马逊物流费用)/)[1] + '\n'
            } catch (err) {
                debugmsg.innerHTML += err
            }
        }
    )
    msgboard.innerHTML = msg
}

document.querySelector('#aba_download').onclick = () => {
    getfbafee()
}
