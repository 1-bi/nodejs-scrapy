const Spider = require('spider')
const reqs = require('../http/request')
const utils_spider = require('../utils/spider')
const Rule = require('./crawl_rule')

class CrawlSpider extends Spider {


    constructor( ) {
        super()
        let self = this
    }

    /**
     * implement spider module
     * @param response
     */
    parse( response ) {
        let self = this
        return self._parse_response( response, self.parse_start_url)

    }

    parseStartUrl(response) {
        return []
    }

    parseResults(response , results) {
        return results
    }

    _build_request(rule_index , link) {
        let req = reqs.Request(link._url)
        return req
    }

    // ---------- private method -------------
    _compile_rules() {
        let self = this
        self._rules = []
        for (let rule in self.rules) {
            // --- copy to len ---
            //self._rules
        }
    }

    _parse_response(response , callback , args ,follow = true) {
        if (callback) {
            let cbResult = callback( response , args )
            cbResult = self.process_results( response , cbResult )
        }

        if (follow) {

        }

    }



    static fromCrawler(crawler, args, kwargs) {
        let cls = this

        //let spider = new cls( args, kwargs )
        //spider._set_crawler(crawler)
        //return spider

    }


}

module.exports = CrawlSpider