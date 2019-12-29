const events = require("events")
var downloadHandler = require('./handlers/downloadhandlers');
var middleware = require("./middleware");
var utils = require("../utils");
const Promise = require("bluebird");

class Slot{

    /**
     *
     * @param concurrency
     * @param delay --- 每次下载处之前的延迟机制
     * @param randomizeDelay
     */
    constructor( concurrency , delay , randomizeDelay ) {
        // 并发数请求数
        let self = this
        self._concurrency = concurrency
        self._delay = delay
        self._randomizeDelay = randomizeDelay

        self._active = {}
        self._queue = []

        self._transferring = {}
        self._lastseen = 0
        self._latercall = null

    }

    freeTransferSlots() {
        let self = this
        return self._concurrency - self._countTransferring();
    }

    addReqToActive( request ) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( !self._active[ reqHash ] ) {
            //  --- add request ---
            self._active[ reqHash ] = request
        }
        else {
            // show log ---
            console.log( 'reqest exist ' )
        }
    }

    addReqToTransferring( request ) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( !self._transferring[ reqHash ] ) {
            //  --- add request ---
            self._transferring[ reqHash ] = request
        }
        else {
            // show log ---
            console.log( 'reqest exist ' )
        }
    }

    removeReqFromActive( request ) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( self._active[ reqHash ] ) {
            //  --- add request ---
            delete self._active[ reqHash ]
        } else {

        }
    }

    removeReqFromTransferring( request ) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( self._transferring[ reqHash ] ) {
            //  --- add request ---
            delete self._transferring[ reqHash ]
        } else {

        }
    }


    getActive() {
        let self = this
        return self._active
    }


    getQueue() {
        let self = this
        return self._queue
    }


    getTransferring() {
        let self = this
        return self._transferring
    }


    downloadDelay() {
        let self = this
        return self._delay
    }

    _countTransferring() {
        let self = this
        let counter = 0
        for (let i in self._transferring) {
            counter = counter + 1
        }
        return counter

    }
}

/**
 * 定义标准事件和对应的 call back 处事
 */
class DownloaderEmitter extends events.EventEmitter {}



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
        _self._active = {}

        _self.DOWNLOAD_SLOT = "download_slot"

        _self.handlers = new downloadHandler.DownloadHandlers(crawler)
        _self.domain_concurrency = crawler.getSettings().getInt('CONCURRENT_REQUESTS_PER_DOMAIN')
        _self.ip_concurrency = crawler.getSettings().getInt("CONCURRENT_REQUESTS_PER_IP")
        _self.randomize_delay = crawler.getSettings().getProperty['RANDOMIZE_DOWNLOAD_DELAY']
        _self._middleware = middleware.DownloaderMiddlewareManager.fromCrawler(middleware.DownloaderMiddlewareManager, crawler)

        _self._emitter = new DownloaderEmitter()

        _self._events = {}

        _self._init()

    }

    _init() {
        let self = this

        // --- define event ---
        self._emitter.on('process_req_queue', function(spider, slot) {
            self._process_queue(spider, slot)
        })

    }


    fetch(request, spider) {
        let _self = this

        // --- not uses => _deactivate

        _self._addReqToActive( request )

        // --- call middleware download ---
        let promise = _self._middleware.download( {
            fn: _self._enqueue_request,
            ref: _self
        },  request, spider)



        promise.finally(function() {
            _self._removeReqFromActive( request )
        })


        return promise

    }

    getActive() {
        let self = this
        return self._active
    }


    /**
     * 下载中间件业务
     * @param middleware
     */
    setMiddleware( middleware ) {
        let _self = this
        _self._middleware  = middleware
    }


    on(eventName , refObj) {
        let self = this
        self._events[eventName] = refObj
    }



    _addReqToActive( request ) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( !self._active[ reqHash ] ) {
            //  --- add request ---
            self._active[ reqHash ] = request
        }
        else {
            // show log ---
            console.log( 'reqest exist ' )
        }
    }

    _removeReqFromActive( request ) {
        let self = this
        let reqHash = request.getReqHash()
        // --- check request ---
        if ( self._active[ reqHash ] ) {
            //  --- add request ---
            delete self._active[ reqHash ]
        } else {

        }
    }

    /**
     * fire call when the download success
     * @param response
     * @private
     */
    _doSuccessCallback( response , request , spider ) {
        let self = this

        self._deactivate(response ,  request , spider  )
        //self.signals.send_catch_log(signal=signals.response_downloaded,response=response,request=request,spider=spider)

        // --- trgger event ---
        let callerFn = self._events['donwload_success']
        if ( callerFn ) {
            let fn = callerFn['fn']
            let ref = callerFn['ref']

            let args = [ response , request , spider  ]
            fn.apply( ref , args  )
        }

        let completeFn = self._events['donwload_complete']
        if ( completeFn ) {
            let fn = completeFn['fn']
            let ref = completeFn['ref']

            let args = [ response , request , spider  ]
            fn.apply( ref , args  )
        }



    }




    /**
     * fire event when the download fail
     * @param err
     * @private
     */
    _doFailureCallback( err ) {

    }


    _finish_transferring(request , slot , spider ) {
        let self = this
        slot.removeReqFromTransferring( request )
        self._process_queue(spider , slot)
    }


    // ---- private method ----
    _download(slot, request , spider ) {
        let self = this

        // --- replase deferred by event
        //self.handlers.addSuccessCallback( self._doSuccessCallback , self )

        //self.handlers.addFailureCallback( self._doFailureCallback , self )


        // # 1. Create the download deferred;
        // use promise to handle function
        //let dfd = utils.mustbeDeferred( {
        //    fn: self.handlers.downloadRequest,
        //    ref: self.handlers
        //} , request ,  spider )
        let promise = self.handlers.downloadRequest( request , spider )

        // # 2. Notify response_downloaded listeners about the recent download
        // _downloaded method
        promise.then( function( response ) {
            // --- finish transferring ---
            let callerFn = self._events['donwload_success']
            if ( callerFn ) {
                let fn = callerFn['fn']
                let ref = callerFn['ref']

                let args = [ response , request , spider  ]
                fn.apply( ref , args  )
            }

            let completeFn = self._events['donwload_complete']
            if ( completeFn ) {
                let fn = completeFn['fn']
                let ref = completeFn['ref']

                let args = [ response , request , spider  ]
                fn.apply( ref , args  )
            }

        })

        /*
         # 3. After response arrives,  remove the request from transferring
        # state to free up the transferring slot so it can be used by the
        # following requests (perhaps those which came from the downloader
        # middleware itself)
         */
        slot.addReqToTransferring( request )

        promise.finally(function() {
            self._finish_transferring( request ,  slot , spider  )
        })
        return promise

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

    /**
     * 一边构建访问请示队列
     * @param request
     * @param spider
     * @returns {utils.Deferred}
     * @private
     */
    _enqueue_request(request , spider) {
        let self = this

        // --- get the request spider ---

        let slotObj = self._get_slot(request, spider)
        let key = slotObj["key"]
        let slot = slotObj["slot"]

        request.meta()[self.DOWNLOAD_SLOT] = key

        /*
        function _deactivate(response) {
            slot.getActive().remove( request )
            return response
        }*/

        // add one request to active queue
        slot.addReqToActive( request  )


        //let deferred = new utils.Deferred()
        //deferred.addBoth( _deactivate )

        // --- append object to queue ---
        slot.getQueue().push( { request:request , deferred:{} } )

        // --- fire event -- queue
        //self._emitter.emit('process_req_queue' , spider, slot )
        return self._process_queue(spider, slot)

        // replace orginal code :self._process_queue(spider, slot)

    }


    /**
     *
     * process queue
     *
     * @param spider
     * @param slot
     * @returns {Promise}
     * @private
     */
    _process_queue(spider, slot) {
        let self = this

        let now = Date.now();
        let delay = slot.downloadDelay()

        // Process enqueued requests if there are free slots to transfer for this slot
        let downloadPromiseArr = []
        while ( slot.getQueue().length > 0  && slot.freeTransferSlots() > 0) {
            slot.lastseen = now
            let queueObj = slot.getQueue().shift()
            let request = queueObj["request"]
            let deferred = queueObj["deferred"]

            // --- invoke download function
            // return promies
            let p = self._download(slot , request ,spider )
            downloadPromiseArr.push( p )

            // prevent burst if inter-request delays were configured
            if (delay) {
                self._process_queue(spider , slot);
                break;
            }
        }
        let allPromises = Promise.all(downloadPromiseArr)
        return allPromises
    }

    /**
     * define activate
     * @param response
     * @param request
     * @param spider
     * @private
     */
    _deactivate(response , request , spider ) {
        let self = this
        let slotObj = self._get_slot(request, spider)
        let key = slotObj["key"]
        let slot = slotObj["slot"]

        slot.removeReqFromActive( request )
        // --- remove active request


    }

}

module.exports.Downloader = Downloader