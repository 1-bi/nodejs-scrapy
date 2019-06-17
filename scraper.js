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

    var itemproc_cls = crawler.getSettings().properties['ITEM_PROCESSOR'];


    var _itemproc = itemproc_cls.fromCrawler(crawler) ;

    function openSpider(spider) {

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

    // ------------ private method -----------
    function _check_if_closing(spider , slot) {
        if (slot.closing && slot.isIdle() ) {
            slot.closing.callback(spider);
        }
    }



}

module.exports.Scraper = Scraper;