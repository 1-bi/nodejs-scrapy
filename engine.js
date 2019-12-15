const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    },
    prettifier: require('pino-pretty')
});
const utils = require('./utils')
const scraper = require('./scraper')


/**
 *  slot ---- 处理Request 请求的一个生命周期
 * @constructor
 */
class Slot {

    constructor(start_requests, nextcall, scheduler) {
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

        self._nextcall = nextcall


        // --- add request to scheduler ---
        self._scheduler.enqueueRequest( self._start_requests )

    }

    addRequest(request) {
        let self = this
        self._inprogress[request] = 1
    }


    close() {

    }


    removeRequest(request) {
        delete _inprogress[request]
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

    next( instArray ) {
        return instArray.pop();
    }

    _fireClosing() {
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

        //self._scheduler = scheduler_cls.fromCrawler( crawler )

        //self._scheduler = settings.getScheduler();
        console.log(  )

        self._downloader = new self._downloader_cls( self._crawler )

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
        self._closewait = new utils.Deferred()
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
    openSpider(spiderInst, oneRequest) {
        let self = this
        if (logger.isLevelEnabled("info")) {
            logger.info({"spider": spiderInst}, "Spider opened")
        }

        let nextcall = new utils.CallLaterOnce(self._next_request, spiderInst , self )

        //  call next request

        // init scheduler ininstance with crawler setting
        let scheduler = self._scheduler_cls.fromCrawler(self._crawler)
        scheduler.open(self._spider)

        let startRequest = oneRequest

        //  定义 Request 处理的生命周期
        let slot = new Slot(startRequest, nextcall, scheduler)
        self._slot = slot
        self._spider = spiderInst


        self._scraper.openSpider(self._spider)


        // --- call curent object
        // should be get the current object
        slot.getNextcall().schedule()

    }

    download(request, spider) {

        var d = _download(request, spider);
        d.addBoth(_downloaded, _slot, request, spider);
        return d;
    }

    // ------------------ private method ------
    _next_request( _spider ) {
        // --- deflay for call object ---
        let self = this


        // --- start download from scheduler ---
        let slot = self._slot

        if (slot == undefined) {
            return
        }

        if (self._paused) {
            return
        }

        // neet to backout
        if (!self._needs_backout( _spider)) {
            self._next_request_from_scheduler( _spider )
        }

        // --- call next request ---
        /*
        if (slot.getStartRequests().length > 0 && !self._needs_backout(_spider)) {
            try {
                let request = self.next(slot.getStartRequests())
                self.crawl(request, _spider)
            } catch (e) {
                logger.error(e)
            }
        }
        */
    }


    next(instArray) {
        return instArray.pop();
    }

    _needs_backout(spider) {
        let self = this
        let backout = false
        let slot = self._slot

        backout = !self._running || slot._closing

        return backout
    }

    _next_request_from_scheduler( spider ) {
        let self = this
        let slot = self._slot


        let request = slot.getScheduler().nextRequest()

        // not found request
        if (!request) {
            logger.info("Url requested from scheduler is undefined. ");
            return
        }

        var d = self._download(request, spider);
        d.addBoth(self._handle_downloader_output, request, spider);
    }

    // --- not implement
    _handle_downloader_output(response, request, spider) {

    }


    _download(request, spider) {
        let self = this

        function _on_success(response) {

        }

        function _on_complete() {

        }

        let dwld = self._downloader.fetch(request, spider)

        dwld.addCallbacks(_on_success)
        dwld.addBoth(_on_complete)
        return dwld

    }

    _downloaded(reqponse, slot, request, spider) {
        slot.removeRequest(request);
    }

    // --- class stop engine
    _finish_stopping_engine () {
        let self = this
        // --- call method without method
        self._closewait.callback()
    }

}

module.exports.ExecutionEngine = ExecutionEngine
module.exports.Slot = Slot

// unuse
function ExecutionEngine2(crawler) {

    var self = this

    var _crawler = crawler
    let _settings = crawler.getSettings()


    var _downloader = null;
    var _downloader_cls = _settings.getProperty("DOWNLOADER")

    var _scheduler = null;
    // --- mapping class ---
    var _scheduler_cls = _settings.getProperty("SCHEDULER_CLASS")


    var _running = false;
    var _paused = false;
    var _scraper = new scraper.Scraper(_crawler);

    var _slot = null;

    // init project
    (function () {
        _scheduler = _settings.getScheduler();
        _downloader = new _downloader_cls(crawler);
    })();


    function setDownloader(downloader) {
        _downloader = downloader;
    };
    self.setDownloader = setDownloader;

    function setScheduler(scheduler) {
        _scheduler = scheduler;
    }

    self.setScheduler = setScheduler;

    function start() {
        // Start the execution engine
        if (_running) {
            throw "Engine already running"
        }

        self.start_time = Date.now()

        // --- start engine , 发送引擎开始执行的信号
        _running = true

        // --- 等待关闭的信号 ---


    }

    self.start = start;

    function stop() {

    }

    self.stop = stop;

    function pause() {

    }

    self.pause = pause;

    function unpause() {

    }

    self.unpause = unpause;


    function close() {

    }

    self.close = close;

    function schedule(request, spider) {
        // --- call schedule , enqueueRequest
        if (!_slot.getScheduler().enqueueRequest(request)) {
            // send send catch log

        }
    }

    self.schedule = schedule;

    function crawl(request, spider) {
        // check the spider input exist in define
        logger.debug({req: request}, " run crawl for request ");
        self.schedule(request, spider);
        _slot.getNextcall().schedule();
    }

    self.crawl = crawl;


    /**
     * 启动爬虫执行操作
     * @param spiderInst
     * @param oneRequest
     */
    function openSpider(spiderInst, oneRequest) {
        let self = this
        if (logger.isLevelEnabled("info")) {
            logger.info({"spider": spiderInst}, "Spider opened")
        }


        var nextcall = new utils.CallLaterOnce(_next_request, spiderInst);

        //  call next request



        // init scheduler ininstance with crawler setting
        var scheduler = self._scheduler_cls.fromCrawler(_crawler);
        var startRequest = oneRequest;

        //  定义 Request 处理的生命周期
        var slot = new Slot(startRequest, nextcall, scheduler);
        _slot = slot;

        _spider = spiderInst;

        scheduler.open(_spider);
        _scraper.openSpider(_spider);


        // --- call curent object
        // should be get the current object

        slot.getNextcall().schedule();

    }

    self.openSpider = openSpider;

    function download(request, spider) {

        var d = _download(request, spider);
        d.addBoth(_downloaded, _slot, request, spider);
        return d;
    }

    self.download = download;


    // ------------------ private method ------
    function _next_request(spider) {
        // --- deflay for call object ---
        console.log(' run next request ')


        // --- start download from scheduler ---
        let slot = _slot;
        if (slot == undefined) {
            return
        }

        if (_paused) {
            return
        }



        // neet to backout
        if (!_needs_backout(_spider)) {
            _next_request_from_scheduler(_spider)
        }


        // --- call next request ---
        if (slot.getStartRequests().length > 0 && !_needs_backout(_spider)) {
            try {
                var request = next(slot.getStartRequests())
                crawl(request, spider)
            } catch (e) {
                logger.error(e)
            }
        }
    }

    function next(instArray) {
        return instArray.pop();
    }

    function _needs_backout(spider) {
        var backout = false;
        var slot = _slot;

        var backout = _running || slot._closing
    }

    function _next_request_from_scheduler(spider) {
        var slot = _slot;

        var request = slot.getScheduler().nextRequest();

        // not found request
        if (!request) {
            logger.info("Url requested from scheduler is undefined. ");
            return
        }


        var d = _download(request, spider);
        d.addBoth(_handle_downloader_output, request, spider);
    }

    // --- not implement
    function _handle_downloader_output(response, request, spider) {

    }


    function _download(request, spider) {


        function _on_success(response) {

        }

        function _on_complete() {

        }

        var dwld = _downloader.fetch(request, spider);

        dwld.addCallbacks(_on_success);
        dwld.addBoth(_on_complete);
        return dwld;

    }

    function _downloaded(reqponse, slot, request, spider) {
        slot.removeRequest(request);
    }
}
