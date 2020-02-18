const util = require('util')
const req = require('../http/request')
const signals = require('../signals')
const err = require('../err')

/**
 * 解析器，负责解析页面内容，输入是HTML的response，输出是结构化的Items；
 * @constructor
 */
class Spider {

    constructor() {
       let self = this
       self._start_urls = []
    }

    /**
     * interface method, should be implement for sub class
     * all request start from interface method
     * @returns {*[]}
     */
    startRequests() {
        throw new err.NotImplmentError("Could not implement method 'Spider.startRequests'")
    }




    /**
     * 添加初始进入的URLS
     * @param urls
     */
    setStartUrls( urls ) {
        let self = this
        if ( typeof urls  === "string" ) {
            self._start_urls.push( urls )
        } else if (typeof urls  === "object" && urls instanceof Array) {
            for (var i = 0 ; i < urls.length ; i++) {
                self._start_urls.push( urls[i] )
            }
        }
    }

    makeRequestsFromUrl(url) {
        // url -> mapping , dont_filter = true
        let r = new req.Request(url, true)

        // --- set header agent ---
        r.setHeaders({
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
        })

        return r
    }

    /**
     * public start request
     * @returns {[]|*[]}
     */
    getStartRequests() {
        let self  = this
        let startReqsArray = []
        for (let i = 0 ; i < self._start_urls.length ; i++) {
            startReqsArray.push( self.makeRequestsFromUrl( self._start_urls[i]) )
        }
        return startReqsArray
    }


    /**
     *  get parse rules , 获得可以匹配页面的处理机制
     */
    getRules() {
        let rules = []


        // --- 执行并 parse 不同的逻辑
        return rules
    }

    /**
     * parse response from page
     * 负责处理业务和整理业务模型
     * @param response
     */
    parse(response) {
        let msg = util.format('%s.parse callback is not defined','NoImplementParse')
        throw new err.NotImplmentError( msg  )
    }

    _set_crawler( crawler ) {
        let self = this
        self._crawler = crawler
        self._settings = crawler._settings

        // --- execute spider implement method ----
        let startRequests = self.startRequests()
        self.setStartUrls( startRequests )
        // --- append metho
        crawler._signals.connect(self.close, signals.spider_closed)
    }


    /**
     *
     * @param crawler
     * @param args
     * @param kwargs
     */
    static fromCrawler(crawler, args, kwargs) {
        let cls = this
        let spider = new cls( args, kwargs )
        spider._set_crawler(crawler)
        return spider

    }
}

module.exports = Spider


