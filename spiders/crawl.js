const Spider = require('./spider')
const reqs = require('../http/request')
const res = require('../http/response')
const utils_spider = require('../utils/spider')
const utils_req = require('../utils/request')
const Rule = require('./crawl_rule')
const err = require('../err')


class CrawlSpider extends Spider {


    constructor( ) {
        super()
        let self = this

        self.rules = []
    }


    addRule( rule ) {
        let self = this
        self.rules.push( rule )
        return self
    }

    /**
     * implement spider module
     * @param response
     */
    parse( response ) {
        let self = this
        let cb_kwargs = []
        let follow = true
        return self._parse_response( response, self.parseStartUrl , cb_kwargs, follow)
    }

    parseStartUrl(response) {
        return []
    }

    parseResults(response , results) {
        return results
    }

    prepareCrawl() {
        throw new err.NotImplmentError("Could not implement method 'CrawlSpider.prepareCrawl'")
    }

    _build_request(rule_index , link) {
        let self = this
        let req = new reqs.Request(link._url)
        req.setCallback( self._callback )
        return req
    }

    _doPrepareCrawl() {
        let self = this
        self.prepareCrawl()
        self._compile_rules()
    }

    // ---------- private method -------------
    _compile_rules() {
        let self = this
        self._rules = []
        for (let i = 0 ; i < self.rules.length ; i++) {
            self.rules[0]._compile( self  )
            self._rules.push( self.rules[0] )
        }
    }


    _callback( response ) {
        let selt = this
        let rule = self._rules[response.meta['rule']]

        console.log('upload call back')

    }

    _parse_response(response , callback , args ,follow = true) {
        let self = this
        if (callback) {
            let cbResult = callback( response , args )
            cbResult = self.parseResults( response , cbResult )
        }

        if (follow) {
            return self._requests_to_follow(response)
        }

    }


    _requests_to_follow( response ) {

        let self = this
        if ( ! (response instanceof res.Response) ) {
            return
        }

        let reqArray = new utils_req.RequestArray()

        let seen = []
        let links = []
        let request = null
        for (let i = 0 ; i < self._rules.length ; i++) {
            links = self._rules[i].getLinkExtractor().extractLinks( response  )
            for (let j = 0 ; j < links.length ; j++ ) {
                let request = self._build_request(j, links[j] )
                self._rules[i].processRequest(request, response)
                reqArray.push( request )
            }
        }
        return reqArray

    }



    static fromCrawler(crawler, args, kwargs) {
        let cls = this

        let spider = super.fromCrawler(crawler ,  args, kwargs )
        spider._doPrepareCrawl()

        //let spider = new cls( args, kwargs )
        //spider._set_crawler(crawler)
        //return spider
        return spider
    }


}

module.exports = CrawlSpider