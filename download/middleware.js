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

        function process_request(request) {

            // call back
            let callObj = downloadFunc['ref']
            let callbackFn = downloadFunc['fn']

            let args = []
            args.push(request)
            args.push(spider)

            callbackFn.apply(callObj , args)
        }

        function process_response(response) {

        }

        //  处理 Exception
        function process_exception(_failure) {

        }

        let deferred = utils.mustbeDeferred(process_request ,  request )
        deferred.addErrback( process_exception );
        deferred.addCallbacks(process_response);

        return deferred
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

// ---

function DownloaderMiddlewareManager2() {

    var self = this;

    function download(downloadFunc , request, spider) {


        function process_request(request) {

            // call back
            let callObj = downloadFunc['ref']
            let callbackFn = downloadFunc['fn']

            let args = []
            args.push(request)
            args.push(spider)

            callbackFn.apply(callObj , args)
        }

        function process_response(response) {

        }

        //  处理 Exception
        function process_exception(_failure) {

        }

        let deferred = utils.mustbeDeferred(process_request ,  request )
        deferred.addErrback( process_exception );
        deferred.addCallbacks(process_response);

        return deferred;

    }
    self.download = download ;

}


DownloaderMiddlewareManager2._get_mwlist_from_settings  = function(cls, settings) {
    var list = [];

    return list;
}


DownloaderMiddlewareManager2.fromCrawler = function(cls , crawler) {
    return common.MiddlewareManager.fromCrawler( DownloaderMiddlewareManager, crawler );
}
