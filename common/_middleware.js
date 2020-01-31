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


MiddlewareManager.fromSettings =  function(cls , settings , crawler) {
    if ( !cls._get_mwlist_from_settings ) {
        throw "Not implement middelet manager.";
    }
    var mwlist = cls._get_mwlist_from_settings(cls, settings);
    var middlewares = [];
    var enabled = [];

    for (var i = 0 ; i < mwlist.length ; i++) {
        // --- create middleware instance ---
        try {

        } catch (e) {
            console.log("----------- output log ");
            console.log(e );
        }

    }


    return new cls(middlewares);




};

MiddlewareManager.fromCrawler = function(cls , crawler) {
    return MiddlewareManager.fromSettings(cls , crawler.getSettings() , crawler );
};


//module.exports.MiddlewareManager = MiddlewareManager;

