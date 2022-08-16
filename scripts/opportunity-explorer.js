{
    const el = document.createElement('div')
    document.body.prepend(el)
    el.setAttribute('id', 'kwsearch')
    el.style.position = 'fixed'
    el.style.zIndex = 1000
    el.style.backgroundColor = 'grey'
    el.style.right = '10px'
    el.innerHTML = `
    <form>
    <label>SearchTerm:<input type="search" name="searchterm"></label>
    <input name="submit" type="submit">
    </form>
    <button id="hidebutton">hide</button>
    <table id="kwtable"></table>
    <textarea id="results"></textarea>
    <style>
    #results {
        height: 500px;
        width: 500px;
        display: none;
    }
    #kwtable tbody {
        display: block;
        overflow: auto;
        height: 500px;
        max-width: 500px;
    }
    .hide {
        display: none;
    }
    </style>
    `
    var hide = false
    el.querySelector('#hidebutton').onclick = function () {
        hide = hide ? false : true
        console.log(hide, this)
        if (hide)
            el.querySelector('#kwtable').classList.add('hide')
        else
            el.querySelector('#kwtable').classList.remove('hide')
    }
    el.querySelector('form').onsubmit = function (e) {
        e.preventDefault()
        this.searchterm.disabled = true
        this.submit.disabled = true
        document.querySelector('#kwtable').innerHTML = 'loading...'
        let kw = this.searchterm.value
        let url = 'https://sellercentral.amazon.com/ox-api/graphql'
        let body = JSON.stringify({
            "operationName": "searchNicheSearchTerms",
            "variables": {
                "input": {
                    "obfuscatedMarketplaceId": "ATVPDKIKX0DER",
                    "partialSearchTerm": kw,
                    "pageSize": 10000
                }
            },
            "query": "query searchNicheSearchTerms($input: SearchNicheRequest) {\n  searchNiches(request: $input) {\n    hits {\n      searchTerm\n      obfuscatedMarketplaceId\n      nicheHits {\n        nicheId\n        obfuscatedMarketplaceId\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
        })
        fetch(url, {
            method: 'post',
            body: body,
            headers: {
            },
        }).then(res => res.json())
            .then(data => {
                let html = ''
                let csvvalue = ''
                results = data.data.searchNiches.hits
                let tablebody = `<thead><tr><th>searchterm ${results.length} results</th></tr></thead><tbody>`
                for (let row in results) {
                    csvvalue += `${results[row].searchTerm}\r`
                    tablebody += `<tr><td>${results[row].searchTerm}</td></tr>`
                }
                tablebody += `</tbody>`
                document.querySelector('#results').value = csvvalue
                document.querySelector('#kwtable').innerHTML = `${tablebody}`
            })
        this.searchterm.disabled = false
        this.submit.disabled = false
    }
}