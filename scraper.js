const engine = require('./engine');


/**
 * Scraper的主要作用是对网络蜘蛛中间件进行管理，通过中间件完成请求，响应，数据分析等工作
 * @param crawler
 * @constructor
 */
function Scraper(crawler) {


    var self = this;

    var _slot ;

    var _crawler = crawler;

    var _signals = crawler.signals;

    var itemproc_cls = crawler.getSettings().getProperty('ITEM_PROCESSOR')


    var _itemproc = itemproc_cls.fromCrawler(crawler) ;

    function openSpider(spider) {
        let self = this
        console.log( engine )
        _slot = new engine.Slot();
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

module.exports.Scraper = Scraper;