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

    var self = this;


    (function () {

    })();

    function freeTransferSlots() {
        return _concurrency - _transferring.length;
    };
    self.freeTransferSlots = freeTransferSlots;

    function getActive() {
        return _active;
    }
    self.getActive = getActive;

    function getQueue() {
        return _queue;
    }
    self.getQueue = getQueue;

    function  getTransferring() {
        return _transferring;
    }
    self.getTransferring = getTransferring;


    function downloadDelay() {
        return _delay;
    }
    self.downloadDelay = downloadDelay;


}

class Downloader {



    /**
     *
     * @param crawler
     */
    constructor( crawler ) {
        let _self = this

        _self._settings = crawler.getSettings()
        _self.signals = crawler.signals
        _self._slots = {}

        _self.DOWNLOAD_SLOT = "download_slot"

        _self.handlers = new downloadHandler.DownloadHandlers(crawler)
        _self.domain_concurrency = crawler.getSettings().getInt('CONCURRENT_REQUESTS_PER_DOMAIN')
        _self.ip_concurrency = crawler.getSettings().getInt("CONCURRENT_REQUESTS_PER_IP")
        _self.randomize_delay = crawler.getSettings().getProperty['RANDOMIZE_DOWNLOAD_DELAY']
        _self._middleware = middleware.DownloaderMiddlewareManager.fromCrawler(middleware.DownloaderMiddlewareManager, crawler)
    }

    fetch(request, spider) {
        let _self = this

        function _deactivate(response) {
            return response;
        }
        // active_add(request)


        let dfd = _self._middleware.download( {
            fn: _self._enqueue_request,
            ref: _self
        },  request, spider)

        dfd.addBoth(_deactivate)
        return dfd
    }


    /**
     * 下载中间件业务
     * @param middleware
     */
    setMiddleware( middleware ) {
        let _self = this
        _self._middleware  = middleware
    }


    // ---- private method ----
    _download(slot, request , spider ) {
        let self = this

        // # 1. Create the download deferred;
        let dfd = utils.mustbeDeferred( {
            fn: self.handlers.downloadRequest,
            ref: self.handlers
        } , request ,  spider )

        // # 2. Notify response_downloaded listeners about the recent download
        function _downloaded(response) {
           // --- receive response result ---


            return response;
        }
        dfd.addCallbacks(_downloaded);

        /*
         # 3. After response arrives,  remove the request from transferring
        # state to free up the transferring slot so it can be used by the
        # following requests (perhaps those which came from the downloader
        # middleware itself)
         */
        // slot.getTransferring().add(request);
        slot.getTransferring().push(request);

        function _finish_transferring() {
            slot.getTransferring().remove(request);
            _process_queue(spider , slot);
        }

        return dfd.addBoth( _finish_transferring );

    }

    _get_slot_key(request , spider) {
        let key =  utils.urlparseCached(request).hostname
        return key
    }

    _get_slot(request,spider) {
        let self = this
        let key = self._get_slot_key(request , spider)

        // --- not found by key , create new one
        if (!self._slots[key]) {
            let conc = self.ip_concurrency > 0 ? self.ip_concurrency : self.domain_concurrency
            let delay = 0
            self._slots[key] = new Slot(conc , delay ,  self.randomize_delay )
        }

        return {"key": key , "slot" : self._slots[key]}

    }

    // process request object
    _enqueue_request(request , spider) {
        let self = this
        // --- get the request spider ---
        let slotObj = self._get_slot(request, spider)
        let key = slotObj["key"]
        let slot = slotObj["slot"]

        request.meta()[self.DOWNLOAD_SLOT] = key


        function _deactivate(response) {

            slot.getActive().remove( request )
            return response
        }
        // add one request to active queue
        slot.getActive().push( request )


        let deferred = new utils.Deferred()
        deferred.addBoth( _deactivate )

        // --- append object
        slot.getQueue().push({
            request:request ,
            deferred:deferred} )

        self._process_queue(spider, slot)
        return deferred;
    }


    //  process queue ---
    _process_queue(spider, slot) {
        let self = this

        let now = Date.now();
        let delay = slot.downloadDelay()


        // Process enqueued requests if there are free slots to transfer for this slot
        while ( slot.getQueue().length > 0  && slot.freeTransferSlots() > 0) {
            slot.lastseen = now;

            let queueObj = slot.getQueue().shift()
            let request = queueObj["request"]
            let deferred = queueObj["deferred"]


            let dfd = self._download(slot , request ,spider );

            // prevent burst if inter-request delays were configured
            if (delay) {
                self._process_queue(spider , slot);
                break;
            }


        }

    }


}

module.exports.Downloader = Downloader
