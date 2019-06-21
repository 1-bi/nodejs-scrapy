const util = require('util');
var common = require("../common");

function DownloaderMiddlewareManager() {

    var self = this;

    function download(request, spider) {

        function process_request(request) {

        }

        function process_response(response) {

        }

        function process_exception(_failure) {

        }


        //  --- call back handle ---
        process_request(request);



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
