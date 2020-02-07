const Promise = require("bluebird")
const utils = require('../utils')
const SpiderMiddlewareManager = require('./spidermw')
const res = require('../http/response')

// constant size
const Constant = {
    'MIN_RESPONSE_SIZE': 1024
}


/**
 * Scraper slog
 */
class Slot {

    constructor( max_active_size = 5000000 ){
        let self = this

        self._max_active_size = max_active_size
        self._queue = []
        self._active = {}
        self._active_size = 0
        self._itemproc_size = 0

        self._init()
    }

    _init() {

    }


    addResponseRequest(response , request ) {
        let self = this
        let reqHash = request.getReqHash()

        let dfd = new utils.Deferred(0)

        self._queue.push({
            'response': response,
            'request': request,
            'deferred': dfd
        })
        if (response instanceof res.Response ) {
            self._active_size += Math.max(response.getHtml().length, Constant.MIN_RESPONSE_SIZE)
        } else {
            self._active_size +=  Constant.MIN_RESPONSE_SIZE
        }

        // --- check request ---
        if ( !self._active[ reqHash ] ) {
            //  --- add request ---
            self._active[ reqHash ] = request
        }
        else {
            // show log ---
            console.log( 'reqest exist ' )
        }


        return dfd

    }


    nextResponseRequestDefferred() {
        let self = this

        // --- pop up query object ---

        // add request



    }


    finishResponse(response , request) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( self._active[ reqHash ] ) {
            //  --- add request ---
            delete self._active[ reqHash ]
        } else {

        }
    }


    getQueue() {
        let self = this
        return self._queue
    }


    isIdel() {
        let self = this
        // --- check queue is zero
        // active counter is zero
        let queueCounter = self._queue.length
        let activeCounter = Object.keys(self._active).length

        let isIdel = ! (queueCounter || activeCounter)
        return isIdel

    }

    needsBackout() {
        let self = this
        return self._active_size > self._max_active_size
    }

}


/**
 * Scraper的主要作用是对网络蜘蛛中间件进行管理，通过中间件完成请求，响应，数据分析等工作
 *
 * @param crawler
 * @constructor
 */
class Scraper {

    constructor( crawler ){
        let self = this
        self._slot = null

        self._spidermw = SpiderMiddlewareManager.fromCrawler(crawler)

        self._crawler = crawler
        self._signals = crawler.signals

        let itemproc_cls = utils.loadObjectCls( crawler.getSettings().getProperty('ITEM_PROCESSOR'), './' )

        console.log( itemproc_cls )
        // --- load object property ---
        self._itemproc = itemproc_cls.fromCrawler(crawler)


        self._init()
    }

    _init() {

    }

    openSpider ( spider ) {
        let self = this
        self._slot = new Slot()
        self._itemproc.openSpider( spider )
    }

    closeSpider(spider) {
        let self = this
        self._slot.close()
        self._check_if_closing(spider, self._slot)
    }


    /**
     *
     * @param response
     * @param request
     * @param spider
     */
    enqueueScrape(response, request , spider) {
        let self = this
        let slot = self._slot
        let dfd = slot.addResponseRequest(response , request )

        function finishScraping() {
            slot.finishResponse(response, request)
            self._checkIfClosing(spider , slot )
            self._scrape_next(spider , slot )
        }
        dfd.addBoth( finishScraping )

        self._scrape_next(spider, slot)

        return dfd

    }

    handleSpiderOutput(result , request , response , spider) {
        let self = this
        // calll middle process
        _process_spidermw_output(null , request , response , spider )
    }

    // ------------ private method -----------
    _checkIfClosing(spider , slot) {
        if (slot.closing && slot.isIdle() ) {
            slot.closing.callback(spider);
        }
    }

    _scrape_next( spider , slot ) {
        let self = this

        while ( slot.getQueue().length > 0) {
            let queueObj = slot.getQueue().shift()
            let dfd = self._scrape(  queueObj['response'] , queueObj['request'] , spider , queueObj['deferred']  )
            /*
            if ( queueObj['deferred'] ) {
                dfd.chainDeferred( queueObj['deferred'] )
            }

             */
        }


    }

    _scrape(response , request , spider , deferred ) {
        let self = this
        // Handle the downloaded response or failure through the spider  callback/errback

        let dfd = self._do_scrape( response , request ,spider , deferred)
        dfd.addErrback(self.handle_spider_error, request, response, spider)
        dfd.addCallback(self.handle_spider_output, request, response, spider)
        // --- add defer call back ---
        return dfd
    }

    /**
     * replace scrape2 method
     * @param response
     * @param request
     * @param spider
     * @returns {null}
     * @private
     */
    _do_scrape( response, request, spider , deferred) {
        let self = this

        let dfd = null
        // Handle the different cases of request's result been a Response or a Failure
        if ( !(response instanceof Error) ) {
            // --- scrape response ---
            dfd = self._spidermw.scrapeResponse( self.callSpider, response, request, spider)
        } else {
            // --- add call spider ---
            dfd = self.callSpider( response , request ,spider  )
            dfd.addErrback( self._log_download_errors )
        }
        return dfd

    }

    callSpider ( result , request , spider ) {
        // --- define request ----
        if ( !result['request'] ) {
            result['request'] = request
        }

        // --- create new defer ---
        let dfd = utils.deferResult( result )

        function callSpiderParse(response) {
            if (request._callback) {
                request._callback( result )
            }

            spider.parse( response  )
        }

        dfd.addCallback( callSpiderParse )
        dfd.addErrback( function(failure) {
            if (request._errback) {
                request._errback( failure )
            }
        })

        return dfd


    }


    _process_spidermw_output(output , request , response , spider) {
        let self = this

        // --- process request spider ----
        // Process each Request/Item (given in the output parameter) returned from the given spider
        if ( output instanceof Request ) {
            self._crawler.getEngine().crawl(ouput , spider );
        } else if ( output == null || ouput == undefined) {
            return
        } else {

        }
    }

}

module.exports.Scraper = Scraper
