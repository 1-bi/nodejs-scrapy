const pino = require('pino');
const Promise = require("bluebird")
const events = require("events")
const utils = require("../../utils")
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

        self._schemes = crawler.getSettings().getProperty("DOWNLOAD_HANDLERS")

        self._emitter = new DownloaderHandlersEmitter()

    }

    /**
     *
     * 返回Promise的对像
     *
     * @typedef {{Promise}}
     * @param request
     * @param spider
     */
    downloadRequest( request , spider ) {
        let self = this

        //let scheme = 'https'
        let scheme = utils.urlparseCached( request ).scheme

        let handler = self._get_handler(scheme)

        if (!handler ) {
            throw "Unsupported URL scheme '%s': %s"
        }

        // replace defer by call back
        let promise = new Promise(function( resolve , reject ) {
            handler.downloadRequest(request , spider , {
                failure: function( err  ) {
                    self._emitter.emit("failure" , err , request ,  spider  )
                    reject( err )
                },
                success: function( response ) {
                    self._emitter.emit("success" , response , request ,  spider )
                    resolve( response  )

                },
                ref: self
            })

        })
        return promise
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
    _load_handler(scheme) {
        let self = this

        let  downloadHandler = null
        try {
            var dhcls = self._schemes[scheme]
            downloadHandler =  new dhcls(self._crawler)
            self._handlers[scheme] = downloadHandler
        } catch (e) {
            logger.error(e)
        }
        return downloadHandler
    }

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

        // --- undefine handler for class ---
        handler = self._load_handler(scheme)

        return handler
    }

}

module.exports.DownloadHandlers = DownloadHandlers
