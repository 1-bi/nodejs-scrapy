

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


DownloaderMiddlewareManager.from_crawler = function(crawler) {


}


module.exports.DownloaderMiddlewareManager = DownloaderMiddlewareManager;

