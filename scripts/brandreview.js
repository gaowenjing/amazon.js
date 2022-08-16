{
    const reviewtable = document.createElement('div')
    document.body.prepend(reviewtable)
    reviewtable.innerHTML = `<table id="reviewtable"></table>`
    const getreviewdata = () => {
        fetch("https://sellercentral.amazon.com/brandcustomerreviews/api/reviews?starFilter=ONE_STAR_RATING&starFilter=TWO_STAR_RATING&starFilter=THREE_STAR_RATING&pageId=0&pageSize=50&sortByType=REVIEW_CREATED_DATE&isAscending=false&includeDone=true", {
            "headers": {
                "accept": "application/json",
                // "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "content-type": "application/json",
                // "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                // "sec-ch-ua-mobile": "?0",
                // "sec-ch-ua-platform": "\"Windows\"",
                // "sec-fetch-dest": "empty",
                // "sec-fetch-mode": "cors",
                // "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sellercentral.amazon.com/brand-customer-reviews/ref=xx_crvws_dnav_xx?includeDone=true&stars=1,2,3",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res => res.json()).then(
            d => {
                const rt = document.querySelector('#reviewtable')
                const thead = document.createElement('thead')
                rt.append(thead)
                thead.innerHTML = `
                <tr>
                    <th>brandName</th>
                    <th>childAsin</th>
                    <th>Rating</th>
                    <th>totalReview</th>
                    <th>reviewId</th>
                    <th>reviewTitle</th>
                    <th>reviewText</th>
                    <th>reviewRating</th>
                    <th>Name</th>
                    <th>reviewTimestamp</th>
                    <th>VP</th>
                    <th>orderId</th>
                    <th>orderTime</th>
                    <th>MSGSentTimestamp</th>
                </tr>
               `
                const tbody = document.createElement('tbody')
                rt.append(tbody)
                d.reviews.forEach(r => {
                    let tr = document.createElement('tr')
                    tr.innerHTML = `
                        <td>${r.brandName}</td>
                        <td>${r.childAsin}<img src="${r.asinThumbnail}" loading="lazy"></td>
                        <td>${r.asinWeightedStarRating}</td>
                        <td>${r.asinTotalReviewCount}</td>
                        <td>${r.reviewId}</td>
                        <td>${r.reviewTitle}</td>
                        <td>${r.reviewText}</td>
                        <td>${r.reviewRating}</td>
                        <td>${r.reviewAuthorPublicName}</td>
                        <td>${r.reviewCreatedTimestamp.split('.')[0]}</td>
                        <td>${r.reviewIsVerifiedPurchase}</td>
                        <td><a href="https://${location.host}/orders-v3/order/${r.orderId}">${r.orderId}</a></td>
                        <td>${r.orderTimestamp}</td>
                        <td>${r.brandHasSentMessageTimestamp}</td>
                        `
                    tbody.append(tr)
                });
            })
    }

    getreviewdata()
}