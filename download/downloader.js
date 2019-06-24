var downloadHandler = require('./handlers/downloadhandlers');
var middleware = require("./middleware");
var utils = require("../utils");


function Slot(concurrency , delay , randomizeDelay) {
    // 并发数请求数
    var _concurrency = concurrency;
    var _delay = delay;
    var _randomizeDelay = randomizeDelay


    var _active = [];
    var _queue = [];

    var _transferring = [];
    var _lastseen = 0 ;
    var _latercall = null;


    (function () {

    })();

    function freeTransferSlots() {

    };
    self.freeTransferSlots = freeTransferSlots;

    function getActive() {

    }
    self.getActive = getActive;


    function downloadDelay() {
        return _delay;
    }
    self.downloadDelay = downloadDelay;


}



function Downloader(crawler) {

    const DOWNLOAD_SLOT = "download_slot";

    var self = this;

    var  _middleware = null ;

    // init project
    (function () {
        self.settings = crawler.getSettings().properties;
        self.signals = crawler.signals;
        self.slots = {}
        self.handlers = new downloadHandler.DownloadHandlers(crawler)
        //self.total_concurrency = self.settings.getint('CONCURRENT_REQUESTS')
        //self.domain_concurrency = self.settings.getint('CONCURRENT_REQUESTS_PER_DOMAIN')
        self.ip_concurrency = crawler.getSettings().properties['CONCURRENT_REQUESTS_PER_IP'];
        self.randomize_delay = crawler.getSettings().properties['RANDOMIZE_DOWNLOAD_DELAY'];
        _middleware = middleware.DownloaderMiddlewareManager.fromCrawler(middleware.DownloaderMiddlewareManager, crawler)
        //self._slot_gc_loop = task.LoopingCall(self._slot_gc)
       // self._slot_gc_loop.start(60)
    })();


    function fetch(request, spider) {

        function _deactivate(response) {
            return response;
        }


        // active_add(request)
        var dfd = _middleware.download(_enqueue_request, request, spider);
        dfd.addBoth(_deactivate);
        return dfd;
    }
    self.fetch = fetch ;


    /**
     * 下载中间件业务
     * @param middleware
     */
    function setMiddleware( middleware ) {
        _middleware = middleware;
    }
    self.setMiddleware = setMiddleware;



    // ---- private method ----
    function _download(slot, request , spider ) {
        // # 1. Create the download deferred;
        var dfd = utils.mustbeDeferred( self.handlers.downloadRequest , request , spider );

        // # 2. Notify response_downloaded listeners about the recent download

        function downloaded(response) {
            return response;
        }
        dfd.addCallback(_downloaded);

        /*
         # 3. After response arrives,  remove the request from transferring
        # state to free up the transferring slot so it can be used by the
        # following requests (perhaps those which came from the downloader
        # middleware itself)
         */
        slot.getTransferring().add(request);


        function _finish_transferring() {
            slot.getTransferring().remove(request);
            _process_queue(spider , slot);
        }

        return dfd.addBoth( _finish_transferring );

    }

    function _enqueue_request(request , spider) {
        // --- get the request spider ---
        var key, slot = _get_slot(request, spider);
        request.meta[DOWNLOAD_SLOT] = key;

        function _deactivate(response) {

            slot.getActive().remove(request);
            return response;
        }

        var deferred = new utils.Deferred();
        deferred.addBoth( _deactivate );
        slot.getQueue().append({request:request , deferred:deferred});
        _process_queue(spider, slot);
        return deferred;
    }


    function  _process_queue(spider, slot) {
        // Process enqueued requests if there are free slots to transfer for this slot

        var now = Date.now();
        var delay = slot.downloadDelay();

        while ( slot.getQueue() && slot.freeTransferSlots() > 0) {
            slot.lastseen = now;

            var request, deferred = slot.getQueue().popleft();
            var dfd = _download(slot , request ,spider );

            // prevent burst if inter-request delays were configured
            if (delay) {
                _process_queue(spider , slot);
                break;
            }


        }

    }


    function _get_slot(request,spider) {
        var key = _get_slot_key(request , spider);

        // --- not found by key , create new one
        if (!_slots[key]) {

            var conc = self.ip_concurrency;
            var delay = 0;
            _slots[key] = new Slot(conc , deply ,   self.randomize_delay );
        }

        return key , _slots[key];

    }

    function _get_slot_key(request , spider) {

        var key =  utils.urlparseCached(request).hostname;
        return key ;
    }





}

module.exports.Downloader = Downloader;
