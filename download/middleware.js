const util = require('util');
const utils = require('../utils')
const common = require("../common")


/**
 * @class
 */
class DownloaderMiddlewareManager {

    /**
     * build contructor
     */
    constructor() {

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

    static _get_mwlist_from_settings( cls, settings ) {
        let list = []
        return list
    }

    static fromCrawler( cls , crawler ) {
        return common.MiddlewareManager.fromCrawler( DownloaderMiddlewareManager, crawler )
    }
}


util.inherits(DownloaderMiddlewareManager, common.MiddlewareManager);


module.exports.DownloaderMiddlewareManager = DownloaderMiddlewareManager;

