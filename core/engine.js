const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    },
    prettifier: require('pino-pretty')
});
const utils = require('../utils')
const scraper = require('./scraper')
const EventEmitter = require('events')
const reqs = require('../http/request')

/**
 * 指定特定的事件定义值
 * @type {{string}}
 */
const EngineEvent = {
    'CLOSE' : 'CLOSE'
}

/**
 * 定义标准事件和对应的 call back 处事
 */
class EngineEmitter extends EventEmitter {}


class StopEngineListener {
    // update constructor
    constructor( timeout = 1000) {

        let self = this

        self._timeout = timeout

        self._stopSignals = false // --- 没有接收到信号

        self._run()
    }

    _run() {
        let self = this

        let currentThread = setInterval(() => {

            if (self._stopSignals) {
                clearTimeout( currentThread )
            }
        }, self._t_handle_downloader_outputimeout)
    }

    stopAndExist( result ) {
        let self = this
        self._stopSignals = true

    }

}


/**
 *  slot ---- 处理Request 请求的一个生命周期
 * @constructor
 */
class Slot {

    constructor(start_requests, closeIfIdle, nextcall, scheduler) {
        let self = this

        self._closing = false
        // 处理 Request 的生命周期
        self._inprogress = {} // requests in progress

        self._start_requests = []


        self._scheduler = scheduler

        if (start_requests instanceof Array) {
            self._start_requests = self._start_requests.concat(start_requests)
        } else {
            self._start_requests.push(start_requests)
        }

        self._closeIfIdle = closeIfIdle

        self._nextcall = nextcall


        // --- add request to scheduler ---
        self._scheduler.enqueueRequest( self._start_requests )

    }

    /**
     * add request to inprogress object
     * @param request
     */
    addRequest( request ) {
        let self = this
        let reqHash = request.getReqHash()
        self._inprogress[reqHash] = request
    }


    close() {
        let self = this
        // --- close object ---
        self._closing = true
        self._mayBeFireClosing()
    }

    getClose() {
        let self = this
        return self._closing
    }

    removeRequest( request ) {
        let self = this
        let reqH0ash = request.getReqHash()
        delete self._inprogress[reqH0ash]
        self._mayBeFireClosing()
    }

    getCloseIfIdle() {
        let self = this
        return self._closeIfIdle
    }


    getNextcall() {
        return this._nextcall
    }

    getScheduler() {
        return this._scheduler
    }

    getStartRequests() {
        return this._start_requests
    }

    _mayBeFireClosing() {
        let self = this
        if (self._closing && (self._inprogress === undefined || self._inprogress.length == 0)) {

            // --- 检查 nextCall 是否不为空，若存在，就直接cancel ---
            if (self._nextcall) {
                self._nextcall.cancel();
            }

        }

    }

}



/**
 * define execution engine object
 * @class
 */
class ExecutionEngine {

    /**
     *
     * @param crawler
     * @param spider_closed_callback close callback
     */
    constructor(crawler , spider_closed_callback) {
        let _self = this
        _self._crawler = crawler

        // --- redefine settings ---
        _self._settings = crawler.getSettings()

        // --- define call back ---
        if (spider_closed_callback ) {
            _self._spider_closed_callback = spider_closed_callback
        }

        _self._emitter = new EngineEmitter()


        _self._init( crawler , _self._settings )

    }


    _init( crawler ,  settings) {
        let self = this

        self._downloader_cls = settings.getProperty("DOWNLOADER")
        let _scheduler_cls = settings.getProperty("SCHEDULER_CLASS")
        self._scheduler_cls = utils.loadObjectCls( _scheduler_cls )

        // --- set running status ---
        self._running = false
        self._paused = false
        self._scraper = new scraper.Scraper(self._crawler)

        self._slot = null

        //self._scheduler = scheduler_cls.fromCrawler( spider )

        //self._scheduler = settings.getScheduler();

        self._downloader = new self._downloader_cls( self._crawler )

        // --- define event ---
        // --- define event ---
        self._emitter.on(EngineEvent.CLOSE, function(spider, slot) {

            self._finish_stopping_engine()
        })

    }


    /**
     *
     * @param downloader
     */
    setDownloader(downloader) {
        let self = this
        self._downloader = downloader
    }

    setScheduler(scheduler) {
        let self = this
        self._scheduler = scheduler
    }

    start() {
        let self = this
        // Start the execution engine
        if (self._running) {
            throw "Engine already running"
        }

        self.start_time = Date.now()

        // --- start engine , 发送引擎开始执行的信号
        self._running = true

        // --- 等待关闭的信号 ---
        //self._closewait = new StopEngineListener(550)
        self._closewait = new utils.Deferred(550)
        return self._closewait
    }

    /**
     * 简化停止模型
     */
    stop() {
        let self = this
        // --- 检查 stop running
        if (self.running) {
            self.running = false
        }
        self._finish_stopping_engine()

    }

    pause() {

    }


    unpause() {

    }

    close() {

    }

    schedule(request, spider) {
        let self = this
        // --- call schedule , enqueueRequest
        if (!self._slot.getScheduler().enqueueRequest(request)) {
            // send send catch log

        }
    }

    crawl(request, spider) {
        let self = this
        // check the spider input exist in define
        logger.debug({req: request}, " run crawl for request ")
        self.schedule(request, spider)
        self._slot.getNextcall().schedule()
    }

    /**
     * 启动爬虫执行操作
     * @param spiderInst
     * @param oneRequest
     */
    openSpider(spiderInst, oneRequest , closeIfIdle = true ) {
        let self = this
        // --- output log ----
        if (logger.isLevelEnabled("debug")) {
            logger.debug({"spider": spiderInst}, "Spider opened")
        }
        else if ( logger.isLevelEnabled("info") ) {
            logger.info("Spider opened ")
        }

        let nextcall = new utils.CallLaterOnce(self._next_request, spiderInst , self )

        //  call next request

        // init scheduler ininstance with spider setting
        let scheduler = self._scheduler_cls.fromCrawler(self._crawler)

        scheduler.open(self._spider)

        let startRequest = oneRequest

        //  定义 Request 处理的生命周期
        let slot = new Slot(startRequest, closeIfIdle, nextcall, scheduler)
        self._slot = slot
        self._spider = spiderInst

        self._scraper.openSpider(self._spider)

        // --- call curent object
        // should be get the current object
        slot.getNextcall().schedule()


    }

    // ------------------ private method ------
    _next_request( _spider ) {

        // --- deflay for call object ---
        let self = this

        // --- start download from scheduler ---
        let slot = self._slot

        try {

            if (slot == undefined) {
                return
            }

            if (self._paused) {
                return
            }

            // neet to backout , loop for scheduler
            while (!self._needs_backout( _spider)) {
                let dfd  = self._next_request_from_scheduler( _spider )
                //  check the promise exist or not , promise handle
                if (!dfd) {
                    break
                }
            }

            // --- call next request ---
            if (slot.getStartRequests().length > 0 && !self._needs_backout(_spider)) {
                try {
                    let request = self.next( slot.getStartRequests() )
                    self.crawl(request, _spider)
                } catch (e) {
                    slot._start_requests = null

                    let msg = 'Error while obtaining start request :'

                    msg = msg + '[spider] ' + JSON.stringify(_spider)
                    logger.error( msg )
                }
            }

            // --- idle and close object
            if (self.spiderIsIdle( _spider ) && slot.getCloseIfIdle() ) {
                self._spiderIdle( _spider )
            }


        } catch (e) {
            console.log( e )
        }


    }

    spiderIsIdle( spider ) {
        let self = this
        let result = true

        // # downloader has pending requests
        let lenDownloaderActive =  utils.lengthSetObj( self._downloader.getActive() )
        if ( !lenDownloaderActive  ) {
            return false
        }

        return result

    }


    /**
     * Called when a spider gets idle. This function is called when there
     * are no remaining pages to download or schedule. It can be called
     * multiple times. If some extension raises a DontCloseSpider exception
     * (in the spider_idle signal handler) the spider is not closed until the
     * next loop and this function is guaranteed to be called (at least) once
     * again for this spider.
     *
     *
     *
     * @param spider
     * @private
     */
    _spiderIdle ( spider ) {
        let self = this
        if ( self.spiderIsIdle( spider ) ) {
            // --- close spider and finish ---
            self.closeSpider( spider, 'finished')
        }

    }


    /**
     * Close (cancel) spider and clear all its outstanding requests
     *
     *
     * @param spider
     * @param reason
     */
    closeSpider( spider, reason='cancelled' ) {
        let self = this
        let slot = self._slot


        if ( slot.getClose() ) {
            return slot.getClose()
        }

        // --- close slot ----
        slot.close()

    }


    next(instArray) {
        return instArray.pop();
    }

    _needs_backout(spider) {
        let self = this
        let backout = false
        let slot = self._slot

        backout = !self._running || slot._closing || self._downloader.needsBackout() || self._scraper._slot.needsBackout()
        return backout
    }

    _next_request_from_scheduler( spider ) {
        let self = this
        let slot = self._slot
        let request = slot.getScheduler().nextRequest()

        // not found request
        if (!request) {
            return
        }

        let dfd = self._download(request, spider)


        dfd.addBoth( function( response  ) {
            let hdfd = self._handle_downloader_output( response , request , spider  )
            //hdfd.callback( response  )
        })
        dfd.addBoth(function() {
            slot.removeRequest( request )
            //slot.nextcall.schedule()
        })
        //d.addBoth(self._handle_downloader_output, request, spider);

        return dfd

    }

    // --- not implement
    _handle_downloader_output(response, request, spider) {
        let self = this

        // downloader middleware can return requests (for example, redirects)
        if (response instanceof reqs.Request) {
            // --- crawl response
            self.crawl(response , spider )
        }

        //  response is a Response or Failure
        let dfd = self._scraper.enqueueScrape( response , request , spider  )

        return dfd

    }


    _download(request, spider) {
        let self = this
        let slot = self._slot
        slot.addRequest( request )

        function _on_success(response) {


        }

        function _on_complete() {

            // --- fire event when the nextcall start
            slot.getNextcall().schedule()
            //self._emitter.emit(EngineEvent.CLOSE)
        }


        let dwld = self._downloader.fetch(request, spider)
        dwld.addCallback( _on_success )
        dwld.addBoth( _on_complete )


        return dwld

    }

    _downloaded(reqponse, slot, request, spider) {
        slot.removeRequest(request);
    }

    // --- class stop engine
    _finish_stopping_engine () {
        let self = this


        // --- call method without method
        //self._closewait.stopAndExist()
    }

}

module.exports = {
    ExecutionEngine : ExecutionEngine,
    Slot : Slot
}
