const pino = require('pino');
const Promise = require("bluebird")
const events = require("events")
const err = require('../../err')
const utils = require("../../utils")
const util = require('util')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
})



class DownloaderHandlersEmitter extends events.EventEmitter {}



/**
 * define download handlers
 */
class DownloadHandlers {

    constructor( crawler ) {
        let self = this

        self._crawler = crawler

        self._schemes = {}  // stores acceptable schemes on instancing

        self._handlers = {} // stores instanced handlers for schemes

        self._notconfigured = {}  // remembers failed handlers

        let handlers = crawler.getSettings().getProperty("DOWNLOAD_HANDLERS_BASE")
        for (let scheme in handlers) {
            self._schemes[scheme] = handlers[scheme]
            self._load_handler(scheme, true)
        }

        self._emitter = new DownloaderHandlersEmitter()

    }

    /**
     *
     * 返回Promise的对像
     *
     * @typedef {{Deferred}}
     * @param request
     * @param spider
     * @param _deferred deffer
     */
    downloadRequest( request , spider , _deferred) {
        let self = this

        //let scheme = 'https'
        let scheme = utils.urlparseCached( request ).scheme
        let handler = self._get_handler(scheme)

        if (!handler ) {
            let errMsg = util.format("Unsupported URL scheme '%s' : %s. ", scheme , self._notconfigured[scheme])
            throw new err.UnsupportedUrlSchemeError(errMsg)
        }

        let defer = handler.downloadRequest(request , spider , _deferred)
        return defer
    }

    addSuccessCallback(fn , thisObj) {
        let self = this
        self._emitter.on('success', function(response , request , spider ) {
            let args = [ response , request , spider ]
            fn.apply( thisObj , args )
        })
    }

    addFailureCallback(fn , thisObj) {
        let self = this
        self._emitter.on('failure', function(err , request , spider ) {
            let args = [ err , request , spider ]
            fn.apply( thisObj , args )
        })

    }

    // ----- private handler -----

    /**
     * get load instance
     * @param scheme
     * @returns {*}
     * @private
     */
    _get_handler(scheme) {
        let self = this
        let handler = self._handlers[scheme]
        if (handler) {
            return handler

        }

        let failedHandlers = self._notconfigured[scheme]
        if ( typeof( failedHandlers) != "undefined" ) {
            return
        }

        let exsitScheme = self._schemes[scheme]
        if (typeof( exsitScheme )  === "undefined") {
            self._notconfigured[scheme] = 'no handler available for that scheme'
            return
        }
        // --- undefine handler for class ---
        handler = self._load_handler(scheme)
        return handler
    }

    _load_handler(scheme , skipLazy = false ) {
        let self = this
        let path = self._schemes[scheme]
        let downloadHandler = null
        try {

            if (typeof(path) === "undefined") {
                let errMsg = util.format("Unsupported URL scheme '%s'. ", scheme)
                throw new err.NotConfiguredError(errMsg)
            }

            let dhcls = utils.loadObjectCls( path )

            if ( !skipLazy ) {
                return
            }
            // --- create inst ---
            downloadHandler =  new dhcls(self._crawler)
            self._handlers[scheme] = downloadHandler
        } catch (e) {

            if (e instanceof err.NotConfiguredError) {
                logger.warn( e.message )
            } else {
                let errMsg = util.format("Loading '%s' for scheme '%s'", path ,scheme)
                logger.error(errMsg)
            }
            self._notconfigured[scheme] = e.message
        }
        return downloadHandler
    }

}

module.exports.DownloadHandlers = DownloadHandlers
