const utils = require("./utils")


class MiddlewareManager {

    constructor( middlewares ) {
        let self = this
        self._component_name  = "foo middlware"

        self._middlewares = middlewares
        self._methods = {
            'open_spider':[],
            'close_spider':[]
        }

        for (let i = 0 ; i < middlewares.length ; i++) {
            self._add_middleware( middlewares[i] )
        }

    }


    openSpider( spider ) {
        let self = this
        self._spider = spider
        self._process_parallel('open_spider', spider)
    }

    closeSpider( spider ) {
        let self = this
        self._spider = spider
        self._process_parallel('close_spider', spider)
    }


    _add_middleware( mw ) {
        let self = this
        // --- bining middleware method ---
        let methodOpenSpider = mw['open_spider']
        let methodCloseSpider = ms['close_spider']

        let hasError = 0
        let errMsg = "Following interface method(s) isn't implement in middleware: \n"
        if ( methodOpenSpider ) {
            self._methods['open_spider'].push( methodOpenSpider)
        } else {
            errMsg = errMsg + "* open_spider \r\n"
            hasError = 1
        }
        if ( methodCloseSpider ) {
            self._methods['close_spider'].push( methodCloseSpider)
        } else {
            errMsg = errMsg + "* close_spider \r\n"
            hasError = 1
        }

        if (hasError) {
            throw new NotImplmentError(errMsg , "ERR-0010034")
        }

    }


    // parallel process middleware
    _process_parallel(methodname , inputObj , args) {

    }


    static _get_mwlist_from_settings(cls , settings ) {
        return 'NOtImplementedError'
    }

    static fromSettings(cls , settings , crawler = null ) {
        let mwlist = cls._get_mwlist_from_settings(settings)
        let middlewares = []
        let enabled = []
        // --- load middleware list ---
        for (let i = 0 ; i < mwlist.length ; i++) {

            try {
                let mwcls = utils.loadObjectCls( mwlist[i] )

                // --- creat instance ---
                let mw = ""

                middlewares.push( mw )

                // --- add class path ---
                enabled.push( mwlist[i] )

            } catch (e) {

                console.log( 'error ' + e )

            } finally {

            }

        }

        return new cls(middlewares)


    }


    static fromCrawler(cls , crawler ) {
        // --- get the cls ----
        let middleManager  = MiddlewareManager.fromSettings( cls , crawler.getSettings() , crawler )
        return middleManager
    }


}


module.exports.MiddlewareManager = MiddlewareManager