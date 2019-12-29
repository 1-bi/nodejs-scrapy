var pkgScheduler = require('../scheduler');
var queue = require("../queue/memory");
var pipelines = require("../pipelines/itemmanager");
var download = require("../download/downloader");
var utils = require("../utils");
var pkgDownloadHandler = require("../download/handlers");


/**
 * define settings
 */
class Settings {

    /**
     *
     * @param defaultSettingObj
     */
    constructor( defaultSettingObj ) {
        let self = this

        // --- init properties ---
        self._scheduler = new pkgScheduler.Scheduler()


        self._properties = {}

        // --- init default setting
        self._init( defaultSettingObj )

    }

    /**
     * private method handle
     * @private
     */
    _init( defaultSettingObj ) {

        let self = this

        self._initWithoutSetting()


        if (defaultSettingObj) {
            self._updateWithSettingInput( defaultSettingObj )
        }
    }

    _initWithoutSetting() {

        let self = this

        self._properties["ITEM_PROCESSOR"] = 'pipelines.itemmanager'

        //self._properties["SCHEDULER_CLASS"] = pkgScheduler.Scheduler
        self._properties["SCHEDULER_CLASS"] = 'scheduler.embbed'
        self._properties["SCHEDULER_MEMORY_QUEUE"] = queue.Memory
        self._properties["DOWNLOADER"] = download.Downloader

        self._properties["DOWNLOAD_HANDLER_CLS"] = {
            //'data': {},
            //'file': {},
            'http': 'download.handlers.hdi.embbed',
            'https': 'download.handlers.hdi.embbed'
        }

        self._properties["DOWNLOAD_HANDLERS"] = {
            //'data': {},
            //'file': {},
            'http': pkgDownloadHandler.Embbed,
            'https': pkgDownloadHandler.Embbed
        }

        self._properties["DOWNLOADER_MIDDLEWARES"] = {
        }

        self._properties["CONCURRENT_REQUESTS_PER_DOMAIN"] = 8
        self._properties["CONCURRENT_REQUESTS_PER_IP"] = 0
        self._properties["RANDOMIZE_DOWNLOAD_DELAY"] = true
    }

    _updateWithSettingInput( defaultSettingObj ) {
        let self = this

        if ( defaultSettingObj[ "ITEM_PROCESSOR" ] ) {
            self._properties["ITEM_PROCESSOR"] = defaultSettingObj[ "ITEM_PROCESSOR" ]
        }

        if ( defaultSettingObj[ "SCHEDULER_CLASS" ] ) {
            self._properties["SCHEDULER_CLASS"] = defaultSettingObj[ "SCHEDULER_CLASS" ]
        }

        if ( defaultSettingObj[ "SCHEDULER_MEMORY_QUEUE" ] ) {
            self._properties["SCHEDULER_MEMORY_QUEUE"] = defaultSettingObj[ "SCHEDULER_MEMORY_QUEUE" ]
        }

        if ( defaultSettingObj[ "DOWNLOADER" ] ) {
            self._properties[ "DOWNLOADER" ] = defaultSettingObj[ "DOWNLOADER" ]
        }


        self._updateAndInitDownloadHandlerCls( defaultSettingObj )


        if ( defaultSettingObj[ "DOWNLOADER_MIDDLEWARES" ] ) {
            self._properties[ "DOWNLOADER_MIDDLEWARES" ] = defaultSettingObj[ "DOWNLOADER_MIDDLEWARES" ]
        }

        if ( defaultSettingObj[ "CONCURRENT_REQUESTS_PER_DOMAIN" ] ) {
            self._properties[ "CONCURRENT_REQUESTS_PER_DOMAIN" ] = defaultSettingObj[ "CONCURRENT_REQUESTS_PER_DOMAIN" ]
        }

        if ( defaultSettingObj[ "CONCURRENT_REQUESTS_PER_IP" ] ) {
            self._properties[ "CONCURRENT_REQUESTS_PER_IP" ] = defaultSettingObj[ "CONCURRENT_REQUESTS_PER_IP" ]
        }

        if ( defaultSettingObj[ "RANDOMIZE_DOWNLOAD_DELAY" ] ) {
            self._properties[ "RANDOMIZE_DOWNLOAD_DELAY" ] = defaultSettingObj[ "RANDOMIZE_DOWNLOAD_DELAY" ]
        }


        // --- convert download class to handler ----
        self._convertDowloadHandlerCls( self._properties["DOWNLOAD_HANDLER_CLS"] )

        // --- test for key ----
        if ( defaultSettingObj[ "testKey" ] ) {
            self._properties[ "testKey" ] = defaultSettingObj[ "testKey" ]
        }
    }

    /**
     *
     * @param defaultSettingObj
     * @private
     */
    _updateAndInitDownloadHandlerCls( defaultSettingObj ) {
        let self = this

        let cls_map =  self._properties["DOWNLOAD_HANDLER_CLS"]
        if ( defaultSettingObj[ "DOWNLOAD_HANDLER_CLS" ] ) {
            cls_map = defaultSettingObj[ "DOWNLOAD_HANDLER_CLS" ]
        }

        if ( defaultSettingObj[ "DOWNLOAD_HANDLER_CLS.https" ] ) {
            self._properties["DOWNLOAD_HANDLER_CLS"]["https"] = defaultSettingObj["DOWNLOAD_HANDLER_CLS.https"]
        }

        if ( defaultSettingObj[ "DOWNLOAD_HANDLER_CLS.http" ] ) {
            self._properties["DOWNLOAD_HANDLER_CLS"]["http"] = defaultSettingObj["DOWNLOAD_HANDLER_CLS.http"]
        }

        if ( defaultSettingObj[ "DOWNLOAD_HANDLER_CLS.file" ] ) {
            self._properties["DOWNLOAD_HANDLER_CLS"]["file"] = defaultSettingObj["DOWNLOAD_HANDLER_CLS.file"]
        }


        if ( defaultSettingObj[ "DOWNLOAD_HANDLER_CLS.data" ] ) {
            self._properties["DOWNLOAD_HANDLER_CLS"]["data"] = defaultSettingObj["DOWNLOAD_HANDLER_CLS.data"]
        }
    }

    _convertDowloadHandlerCls( inputProps ) {
        let self = this

        if ( !inputProps ) {
            return
        }


        for (let i in inputProps) {
            if ( inputProps[i] ) {
                let cls = utils.loadObjectCls( inputProps[i]  )
                self._properties["DOWNLOAD_HANDLERS"][i] = cls
            }
        }

    }


    /**
     *
     * @param key
     * @returns {*}
     */
    getProperty( key ) {
        let self = this

        let keyParts = key.split(".")

        let result = null
        // --- get for the loop ---
        for (let i = 0 ; i < keyParts.length ; i++) {

            if (result) {
                result = result[ keyParts[i] ]
            } else {
                result = self._properties[ keyParts[i] ]
            }

        }

        return result
    }

    getScheduler() {
        let  self = this
        return self._scheduler
    }


    getInt(key) {
        let self = this
        let  value = self._properties[key]
        if (typeof value === "string") {
            return parseInt(value, 10)
        } else {
            return value
        }
    }


    /**
     *
     * @param key
     * @returns {*}
     */
    static build() {

        let _inst = new Settings(this.__ctxProperties)

        return _inst
    }

    static setProperty( key , value) {
        this.__ctxProperties[key] = value
        return this

    }

    static setScheduler( scheduler ) {
        var _self = this

        if (scheduler) {
            _self._scheduler = scheduler
        }

        return _self
    }

    static maxRetryTimes() {
        let self = this
        return self
    }

    /**
     *
     * @returns {Settings}
     */
    static newCls() {
        let _self = this
        _self.__ctxProperties = {}
        return _self
    }
}

Settings.__ctxProperties = {}

module.exports = Settings;