const pino = require('pino');
const logger = pino({
    prettyPrint: {
        levelFirst: true
    },
    prettifier: require('pino-pretty')
});
const utils = require('./utils');
const scraper = require('./scraper');


/**
 *  slot ---- 处理Request 请求的一个生命周期
 * @constructor
 */
function Slot( start_requests  , nextcall , scheduler ) {

    var self = this ;

    var _closing = false ;

    // 处理 Request 的生命周期
    var _inprogress = {};

    var _start_requests = start_requests;

    var _nextcall = nextcall;


    var _scheduler = scheduler;


    function addRequest( request ) {
        _inprogress[ request ] = 1 ;
    }
    self.addRequest = addRequest;

    function removeRequest( request ) {
        delete _inprogress[ request ];
    }
    self.removeRequest = removeRequest;

    function close() {

    }
    self.close = close ;

    function getNextcall() {
        return _nextcall;
    }
    self.getNextcall = getNextcall;


    function _fireClosing() {
        if (_closing  && (_inprogress === undefined || _inprogress.length == 0 ) ) {

            // --- 检查 nextCall 是否不为空，若存在，就直接cancel ---
            if  (_nextcall) {
                _nextcall.cancel();
            }

        }

    }

}



function ExecutionEngine( crawler ) {

    var self = this;

    var _crawler = crawler ;
    var _settings = crawler.getSettings();


    var _downloader  = null;

    var _scheduler = null;
    // --- mapping class ---
    var _scheduler_cls = _settings.properties["SCHEDULER_CLASS"];


    var _running = false;
    var _paused = false;
    var _scraper = new scraper.Scraper(_crawler);

    var _slot = null;

    // init project
    (function () {
        _scheduler = _settings.getScheduler();
    })();


    function setDownloader( downloader ) {
        _downloader = downloader;
    };
    self.setDownloader = setDownloader;

    function setScheduler( scheduler ) {
        _scheduler = scheduler ;
    }
    self.setScheduler = setScheduler;

    function start() {
        // Start the execution engine
        if (_running) {
            throw "Engine already running"
        }

        self.start_time = Date.now();

        // --- start engine , 发送引擎开始执行的信号
        _running = true ;

        // --- 发送正在关闭的信号 ---


    }
    self.start = start ;

    function stop() {

    }
    self.stop = stop;

    function pause() {

    }
    self.pause = pause ;

    function unpause() {

    }
    self.unpause = unpause ;


    function close() {

    }
    self.close = close ;

    function schedule(request , spider) {
        if(_slot.scheduler.enqueueRequest(request) ) {

        }
    }
    self.schedule = schedule;


    /**
     * 启动爬虫执行操作
     * @param spiderInst
     * @param oneRequest
     */
    function openSpider(spiderInst , oneRequest) {

       if  (logger.isLevelEnabled("info") ) {
           logger.info({"spider": spiderInst },"Spider opened")
       }

       var  nextcall = new utils.CallLaterOnce(_next_request, spiderInst);

       //  call next request
       // _next_request(spiderInst)

       // init scheduler ininstance with crawler setting
       var scheduler = _scheduler_cls.fromCrawler(_crawler);
       var startRequest = null;

       //  定义 Request 处理的生命周期
       var slot = new Slot(startRequest, nextcall, scheduler);
       _slot = slot ;

       _spider = spiderInst;

       scheduler.open(_spider);
       _scraper.openSpider(_spider);


       slot.getNextcall().schedule();


    }
    self.openSpider = openSpider;

    function download(request, spider)  {
        var d = _download(request, spider);
        d.addBoth(_downloaded , _slot , request , spider );
        return d ;
    }
    self.download = download;


    // ------------------ private method ------
    function _next_request(spider) {
        // --- start download from scheduler ---
        var slot = _slot;
        if ( slot == undefine ) {
            return ;
        }

        if (_paused) {
            return ;
        }

    }

    function _download(request, spider) {

        function _on_success(response) {

        }

        function _on_complete() {

        }

        var dwld = _downloader.fetch(request ,spider);
        dwld.addCallbacks(_on_success);
        dwld.addBoth(_on_complete);
        return dwld;

    }

    function  _downloaded(reqponse ,  slot ,  request , spider ) {
        slot.removeRequest(request);
    }



}

module.exports.ExecutionEngine = ExecutionEngine;
module.exports.Slot = Slot;
