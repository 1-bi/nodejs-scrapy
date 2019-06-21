var downloadHandler = require('./handlers/downloadhandlers');
var middleware = require("./middleware");


function Slot() {


    (function () {

    })();

}



function Downloader(crawler) {

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
       // self.ip_concurrency = self.settings.getint('CONCURRENT_REQUESTS_PER_IP')
       // self.randomize_delay = self.settings.getbool('RANDOMIZE_DOWNLOAD_DELAY')
        _middleware = middleware.DownloaderMiddlewareManager.fromCrawler(middleware.DownloaderMiddlewareManager, crawler)
        //self._slot_gc_loop = task.LoopingCall(self._slot_gc)
       // self._slot_gc_loop.start(60)
    })();


    function fetch(request, spider) {


        // active_add(request)
        _middleware.download(request, spider);
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

    }

    function _enqueue_request(request , spider) {

    }



}

module.exports.Downloader = Downloader;
