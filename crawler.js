const eng = require('./engine')
const middleware = require('./download/middleware')
const CodeErr = require('./codeerr')
const err = require('./err')
const spiders = require('./spiders')
const SignalManager = require('./signalmanager')
const Settings = require('./settings')
const utils = require('./utils')
const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
});


/**
 * 爬虫任务执行器入口
 * @constructor
 */
class Crawler {

    /**
     *
     * @param spidercls
     * @param settings 定义crawler变量值
     */
    constructor(spidercls ,  settings = undefined) {

        let self = this

        if (spidercls instanceof spiders.Spider) {
            // throw new instance error
            throw new CodeErr('The spidercls argument must be a class, not an object' , 'err-0001')
        }
        let _settings = null
        if (!settings) {
            _settings = new Settings({})
        }

        self._spidercls = spidercls
        self._settings = settings.copy()

        // update settings object from spider cls
        //self._spidercls.update_settings(self.settings)
        self._signals = new SignalManager(self)

        let statsCollectorCls = utils.loadObjectCls( self._settings.getProperty('STATS_CLASS') )
        self._stats = new statsCollectorCls(self)


        // --- init logger ---
        self._settings.freeze()
        self._crawling = false
        self._spider = null
        self._engine = null
    }

    getSettings() {
        let self = this
        return self._settings
    }


    crawl(args , kwargs ) {
        let self = this
        if ( self._crawling ) {
            throw new Error('Crawling already taking place')
        }

        self._crawling = true

        try {

            self._spider  = self._create_spider( args , kwargs )


            self._engine = self._create_engine()

            // --- return start request , popup the first url request ---
            let startRequests = self._spider.getStartRequests()
            self._check_start_request( startRequests )
            startRequests = startRequests.shift()

            // --- open engine splider request , 执行引擎的open_spider，并传入爬虫实例和初始请求
            self._engine.openSpider(self._spider, startRequests)

            // --- add engine start to defer ---
            return self._engine.start()

        } catch (e) {
            logger.error( e )
            self._crawling = false
            if (self._engine) {
                return self._engine.close()
            }


        }

    }


    /**
     * check request start value
     * @param startRequests
     * @private
     */
    _check_start_request(startRequests) {
        if ( !startRequests ) {
            throw new Error("Request started is undefined.")
        }

        if ( typeof startRequests === "string"  ) {
            throw new err.IllegalArguementError('The type of request started should be array.')
        }
        else if ( typeof startRequests === "object" ) {
            if (startRequests instanceof  Array) {
                if (startRequests.length == 0) {
                    throw new Error("Please add one request start to array at least.")
                }
            }
        }
    }


    /**
     *
     * @param args
     * @param kwargs
     * @returns {Spider}
     * @private
     */
    _create_spider( args , kwargs ) {
        let self = this
        let spider = self._spidercls.fromCrawler(self, args, kwargs)
        return spider
    }

    /**
     *
     * @returns {ExecutionEngine}
     * @private
     */
    _create_engine() {
        let self = this

        let engine = new eng.ExecutionEngine(self , function(){
            // stop call back
        })
        return engine
    }



    _get_spider_loader(settings) {
        let clsPath = settings.get('SPIDER_LOADER_CLASS')

    }
}

module.exports = Crawler




// ------------------------------------- out message
function Crawler2(spi ,  settings) {

    var self = this

    // 网页下载器
    var _downloader

    // 爬虫请求调度器
    var _scheudler

    // 网页解析器
    var _pageParser

    // 数据处理器
    var _pipeline



    // 爬虫运行设置
    var _settings
    if (settings)  {
        _settings = settings
    }


    //  --- set the crawling status ---
    var _crawling = false

    // 爬虫执行逻辑
    var _spider = spi

    // 执行核心引擎
    var _engine

    // init project ，初始化相关变量
    (function() {

    })();


    function getSettings() {
        return _settings
    }
    self.getSettings = getSettings;

    function getEngine() {
        return _engine
    }
    self.getEngine = getEngine;



    /**
     * start Spider splider executor
     */
    function start( ) {

        // --- get pendding url  ----
        _init()

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
            let result = _engine.start()


        } catch (e) {

            _crawling = false;
            if ( _engine != null )  {
                _engine.close();
            }
            logger.error(e);
        }

    }


    function _create_engine() {


        var engine = new eng.ExecutionEngine(self , function(){
            // stop call back
        })


        return engine
    }

}

module.exports = Crawler