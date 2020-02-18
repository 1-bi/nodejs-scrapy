const response = require('./response')
const cheerio = require('cheerio')
const xpath = require('xpath'), dom = require('xmldom').DOMParser
const xpathToCss = require('xpath-to-css')

class  HtmlResponse extends response.Response  {

    /**
     * build response object from request -
     * @param request
     */
    constructor( request ) {
        super( request )
        let self = this
    }

    /**
     * 构建当前指定的响应对应处理
     * @param respInst
     */
    buildResponse( respInst ) {
        let self = this
        try {
            self._$ = cheerio.load( respInst.text )

            self._parseRespEncoding()

            self._url = self._request.getUrl()

        } catch (e) {
            console.log('error : -> ')
            console.log( e  )
        }
        return self
    }

    /**
     *  ===========================================
     *     public method ----
     *  ===========================================
     */
    getText() {

    }

    /**
     * Find the element by xpath
     * Named xpath
     * @param query
     * @returns {*[]}
     */
    findByXpath( query ) {
        let self = this
        let cssQuery = xpathToCss(query)

        //let  doc = new dom().parseFromString( self._html  )
        //let  nodes = xpath.select(query , doc)
        return self.findByCss( cssQuery )
    }

    /**
     * Find the element by css
     * Named css 
     * @param query
     * @returns {*[]}
     */
    findByCss(query) {
        let self = this
        return self._$( query )
    }


    // --------- private method ----
    _parseRespEncoding( ) {
        let self = this
        let attrVal = self._$('meta[http-equiv="Content-Type"]').attr('content')
        let vals = attrVal.split(";")
        self._encoding = null
        for (let i = 0 ; i < vals.length ; i++) {
            let val = vals[i].trim().toLocaleLowerCase()
            if (val.indexOf("charset") > -1) {
                self._encoding = val.substring(8 , val.length)
            }
        }
    }


}

module.exports = HtmlResponse