const util = require('util');
const utils = require('../utils')
const middleware = require("../middleware")


/**
 * @class
 */
class DownloaderMiddlewareManager extends middleware.MiddlewareManager {

    /**
     * build contructor
     */
    constructor(middlewares) {
        super( middlewares )
        let self = this
        self._component_name  = "downloader middleware"
    }


    download( downloadFunc , request, spider ) {

        function process_response(response) {
            return response
        }

        //  处理 Exception
        function process_exception(_failure) {
            return _failure
        }

        // execute method call back ---
        let callObj = downloadFunc['ref']
        let callbackFn = downloadFunc['fn']

        let args = []
        args.push(request)
        args.push(spider)

        let dfd   = callbackFn.apply(callObj , args)
        // --- check deferred class type ---
        dfd.addCallback( process_response )
        dfd.addErrback( process_exception )

        return dfd

    }

    static _get_mwlist_from_settings( settings ) {
        let props = settings.getProperty('DOWNLOADER_MIDDLEWARES_BASE')
        return Object.keys(props)
    }

}


module.exports.DownloaderMiddlewareManager = DownloaderMiddlewareManager;

