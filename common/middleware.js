const pino = require('pino');
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
});



function MiddlewareManager(middlewares) {

    var self = this;


    var _middlewares = [];

    // init function
    (function() {
        _middlewares = middlewares;

    })();


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


MiddlewareManager.fromSettings =  function(settings , crawler) {

};

MiddlewareManager.fromCrawler = function(crawler) {

    return MiddlewareManager.fromSettings(crawler.getSettings() , crawler );
};


module.exports.MiddlewareManager = MiddlewareManager;

