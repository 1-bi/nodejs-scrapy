/**
 * Scraper slog
 */
class Slot {

    constructor( max_active_size=5000000 ){
        let self = this

        self._queue = []
        self._active = []
        self._active_size = 0
        self._itemproc_size = 0

        self._init()
    }

    _init() {

    }


    addResponseRequest(response , request ) {

    }


    nextResponseRequestDefferred() {

    }

    finishresponse(response , request) {

    }

    isIdel() {

    }

    needsBackout() {

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

        self._crawler = crawler

        self._signals = crawler.signals

        let itemproc_cls = crawler.getSettings().getProperty('ITEM_PROCESSOR')

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



    enqueueScrape(response, request , spider) {
        let self = this
        let slot = self._slot
        var dfd = slot.addResponseRequest(response , request )

        function finishScraping() {
            slot.finishResponse(response, request);
            self._check_if_closing(spider , slot );
            self._scape_net(spider , slot );
        }
        dfd.addBoth( finishScraping );

    }



    handleSpiderOutput(result , request , response , spider) {
        let self = this
        // calll middle process
        _process_spidermw_output(null , request , response , spider )
    }

    // ------------ private method -----------
    _check_if_closing(spider , slot) {
        if (slot.closing && slot.isIdle() ) {
            slot.closing.callback(spider);
        }
    }

    _process_spidermw_output(output , request , response , spider) {
        let self = this

        // --- process request spider ----
        self._crawler.getEngine().crawl(request , spider );
    }

}

module.exports.Scraper = Scraper



/**
 * unuse 2
 * @param crawler
 * @constructor
 */
function Scraper2(crawler) {


    var self = this;

    var _slot ;

    var _crawler = crawler;

    var _signals = crawler.signals;

    var itemproc_cls = crawler.getSettings().getProperty('ITEM_PROCESSOR')

    var _itemproc = itemproc_cls.fromCrawler(crawler) ;

    function openSpider(spider) {
        let self = this
        _slot = new Slot()
        _itemproc.openSpider( spider );
    }
    self.openSpider = openSpider;

    function closeSpider(spider) {
        _slot.close();
        _check_if_closing(spider, _slot);
    }
    self.closeSpider = closeSpider;


    function closeSpider(spider) {
        _slot.closing = true ;
    }

    function enqueueScrape(response, request , spider) {
        var slot = slot ;
        var dfd = slot.addResponseRequest(response , request );

        function finishScraping() {
            slot.finishResponse(response, request);
            _check_if_closing(spider , slot );
            _scape_net(spider , slot );
        }
        dfd.addBoth( finishScraping );

    }
    self.enqueueScrape = enqueueScrape;


    function handleSpiderOutput(result , request , response , spider) {
        // calll middle process
        _process_spidermw_output(null , request , response , spider );
    }
    self.handleSpiderOutput = handleSpiderOutput;

    // ------------ private method -----------
    function _check_if_closing(spider , slot) {
        if (slot.closing && slot.isIdle() ) {
            slot.closing.callback(spider);
        }
    }

    function _process_spidermw_output(output , request , response , spider) {
        // --- process request spider ----
        _crawler.getEngine().crawl(request , spider );
    }

}
