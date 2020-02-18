const FilteringLinkExtractor = require('./filtering')
const utils_response = require('../utils/response')
const utils = require('../utils')
const cheerio = require('cheerio')
const Link = require('../link')

class XhtmlLinkExtractor extends FilteringLinkExtractor{

    constructor( opts) {
        super( opts )
    }


    /**
     *
     * @param response
     * @returns {any[]}
     */
    extractLinks( response ) {
        let self = this
        let baseUrl = utils_response.getBaseUrl( response )

        // --- found doms array ---
        let  domSelector = []
        if (self._restrict_xpaths) {
            // --- find element by element ----
            for (let i = 0 ; i < self._restrict_xpaths.length ; i++) {
                let selectors = response.findByXpath( self._restrict_xpaths[i] )
                selectors.each((i, e) => {
                    domSelector.push( response._$(e) )
                })
            }
        }
        else {
            for (let i = 0 ; i < self._restrict_css.length ; i++) {
                let selectors = response.findByCss( self._restrict_css[i] )
                domSelector.concat( selectors  )
            }
        }


        // --- build all links ---
        let allLinks = []

        let $selector = null
        for (let i = 0 ; i < domSelector.length ;i++) {
            $selector = domSelector[i]
            let tmp = self._extract_links( $selector , response._url, response._encoding, baseUrl)
            for (let j =0 ; j < tmp.length ; j++) {
                allLinks.push( tmp[j] )
            }
        }

        return allLinks
    }

    // ---- private method ---
    _extract_links( selector, response_url, response_encoding, base_url ) {
        let links = []

        try {
            let append_url = selector.attr('href')

            let relVal = selector.attr('rel')
            let containNoFlollow = false
            if (relVal) {
                if (relVal.toLocaleLowerCase().indexOf('nofollow') > -1) {
                    containNoFlollow= true
                }
            }
            let newurl = utils.urljoin( base_url , append_url )
            let link = new Link(newurl , selector.text().substring() , '', containNoFlollow )
            links.push( link )
        } catch (e) {

            console.log('parse url error ')
            console.log( e )

        }
        //let $ = cheerio.load(dom)
        //console.log( $('a').length )

        return links
    }
}

module.exports = XhtmlLinkExtractor