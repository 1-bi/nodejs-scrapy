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

        }

        //  处理 Exception
        function process_exception(_failure) {

        }

        // execute method call back ---
        let callObj = downloadFunc['ref']
        let callbackFn = downloadFunc['fn']

        let args = []
        args.push(request)
        args.push(spider)

        let promise  = callbackFn.apply(callObj , args)
        promise.then( process_response, process_exception )


        return promise

        /*

        let deferred = utils.mustbeDeferred(process_request ,  request )
        deferred.addErrback( process_exception );
        deferred.addCallbacks(process_response);
        */
        //return deferred
    }

    static _get_mwlist_from_settings( settings ) {
        let props = settings.getProperty('DOWNLOADER_MIDDLEWARES_BASE')
        return Object.keys(props)
    }

}


module.exports.DownloaderMiddlewareManager = DownloaderMiddlewareManager;

