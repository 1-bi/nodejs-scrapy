const {  isMainThread, parentPort, workerData, threadId,
    MessageChannel, MessagePort, Worker } = require('worker_threads')

var eng = require('./engine');
var middleware = require('./download/middleware');
const pino = require('pino');
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
});


/**
 * 爬虫任务执行器入口
 * @constructor
 */
function Crawler(spi ,  settings) {

    var self = this;

    // 网页下载器
    var _downloader;

    // 爬虫调度器
    var _scheudler;

    // 网页解析器
    var _pageParser;

    // 数据处理器
    var _pipeline;



    // 爬虫运行设置
    var _settings;
    if (settings)  {
        _settings = settings;
    }


    //  --- set the crawling status ---
    var _crawling = false;

    // 爬虫执行逻辑
    var _spider = spi;

    // 执行核心引擎
    var _engine;

    // init project ，初始化相关变量
    (function() {

    })();


    function getSettings() {
        return _settings;
    }
    self.getSettings = getSettings;

    function getEngine() {
        return _engine;
    }
    self.getEngine = getEngine;



    /**
     * start Spider splider executor
     */
    function start( ) {

        // --- get pendding url  ----
        _init()


        if (isMainThread) {
            let worker = new Worker(__filename, { workerData: 0 });
        }

        console.log(123456)
        console.log("---------")


        // ---  开始爬虫 ---
        let defered = _crawl()
        return defered
    }
    self.start = start


    /**
     * stop spider executor
     */
    function stop() {

    }
    self.stop = stop ;


    function _init() {


        // ---- create download object ---
        var mw  = middleware.DownloaderMiddlewareManager.fromCrawler(middleware.DownloaderMiddlewareManager, self)



    }

    //  map class  Crawler crawl method
    function _crawl() {

        _crawling = true





        try {
            _engine = _create_engine();

            // --- return start request , popup the first url request ---
            let startRequests = _spider.getStartRequests().shift()

            // --- open engine splider request , 执行引擎的open_spider，并传入爬虫实例和初始请求
            _engine.openSpider(_spider, startRequests)


            // ---- 启动执行，发送引擎运作信号 ---
            return _engine.start();

        } catch (e) {

            _crawling = false;
            if ( _engine != null )  {
                _engine.close();
            }
            logger.error(e);
        }

    }


    function _create_engine() {

        var engine = new eng.ExecutionEngine(self);

        engine.stop();
        return engine;
    }





}

module.exports = Crawler;
