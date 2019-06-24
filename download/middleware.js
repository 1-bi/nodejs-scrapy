const util = require('util');
const utils = require('../utils');
var common = require("../common");

function DownloaderMiddlewareManager() {

    var self = this;

    function download(downloadFunc , request, spider) {

        function process_request(request) {

            // call back
            downloadFunc(request , spider);
        }

        function process_response(response) {

        }

        function process_exception(_failure) {

        }


        //  --- call back handle ---
        process_request(request);

        var deferred = utils.mustbeDeferred(process_request ,  request);
        deferred.addErrback( process_exception );
        deferred.addCallbacks(process_response);

        return deferred;

    }
    self.download = download ;

}


DownloaderMiddlewareManager._get_mwlist_from_settings  = function(cls, settings) {
    var list = [];

    return list;
}


DownloaderMiddlewareManager.fromCrawler = function(cls , crawler) {
    return common.MiddlewareManager.fromCrawler( DownloaderMiddlewareManager, crawler );
}

util.inherits(DownloaderMiddlewareManager, common.MiddlewareManager);


module.exports.DownloaderMiddlewareManager = DownloaderMiddlewareManager;

// ---
