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


DownloaderMiddlewareManager.fromCrawler = function(crawler) {
    return common.MiddlewareManager.fromCrawler( crawler );
}

util.inherits(DownloaderMiddlewareManager, common.MiddlewareManager);


module.exports.DownloaderMiddlewareManager = DownloaderMiddlewareManager;

// ---
