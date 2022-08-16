(function () {
    'use strict';

    var promotionid = localStorage.promotionid
    var startdate = localStorage.startdate
    var enddate = localStorage.enddate
    var starttime = localStorage.starttime
    var endtime = localStorage.endtime
    var desprefix = localStorage.desprefix
    var seq = localStorage.seq
    var el = document.createElement('div')
    el.innerHTML = `promotion id:<input id="promotionid" value="${promotionid}"> <br>startdate:<input id="startdate" value="${startdate}"> enddate:<input id="enddate" value="${enddate}"><br>
    starttime:<input id="starttime" value="${starttime}"> endtime:<input id="endtime" value="${endtime}"> <br>
    desprefix:<input id="desprefix" value="${desprefix}"> seq:<input id="seq" value="${seq}"> <input id="addpromote" type="submit" value="run"><button id="stopbtn">stop</button>`
    document.body.prepend(el)
    document.getElementById('stopbtn').addEventListener('click', function () {
        location.href = '#stop';
        localStorage.promotionid = '';
        document.querySelector('#promotionid').value = ''
    })
    document.getElementById('addpromote').addEventListener('click', function () {
        localStorage.promotionid = document.querySelector('#promotionid').value
        localStorage.starttime = document.querySelector('#starttime').value
        localStorage.endtime = document.querySelector('#endtime').value
        localStorage.startdate = document.querySelector('#startdate').value
        localStorage.enddate = document.querySelector('#enddate').value
        localStorage.desprefix = document.querySelector('#desprefix').value
        localStorage.seq = document.querySelector('#seq').value
        var promotionurl = `https://${location.host}/promotions/duplicate?promotionId=${localStorage.promotionid}`

        if (location.href != promotionurl) {
            location.href = promotionurl
        }
    })
    var promotionurl = `https://${location.host}/promotions/duplicate?promotionId=${localStorage.promotionid}`
    var reviewurl = `https://${location.host}/promotions/new/preview`
    var finishedurl = `https://${location.host}/promotions/new/submit#&tab=create-your-promotions`
    if (location.href == promotionurl) {

        document.querySelector(`#startTimeNative option[value="${starttime}"]`).setAttribute('selected', '')
        document.querySelector(`#endTimeNative option[value="${endtime}"]`).setAttribute('selected', '')
        document.querySelector('#startDate').value = startdate
        document.querySelector('#endDate').value = enddate

        document.querySelector('#internalDescription').value = desprefix + seq

        setTimeout(function () {
            if (location.href == promotionurl) {
                document.querySelector('#a-autoid-1').click()
            }
        }, 5000)
    }
    if (location.href == reviewurl && parseInt(localStorage.seq) > 0) {
        setTimeout(function () {
            // here submit the real promition
            if (location.href == reviewurl) {
                document.querySelector('#a-autoid-1').click()
            }
        }, 5000)
    }
    if (location.href == finishedurl && parseInt(localStorage.seq) > 0) {
        localStorage.seq = parseInt(localStorage.seq) - 1
        setTimeout(function () {
            if (location.href == finishedurl) {
                location.href = promotionurl
            }
        }, 5000)
    }
})();
