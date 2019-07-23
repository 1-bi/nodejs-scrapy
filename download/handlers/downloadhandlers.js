const pino = require('pino');
const utils = require("../../utils");
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
});


function DownloadHandlers(crawler) {

    var self = this;

    var _crawler = crawler;

    var _schemes = {};    // stores acceptable schemes on instancing

    var _handlers = {};  // stores instanced handlers for schemes


    // init function
    (function() {
        _schemes = crawler.getSettings().properties["DOWNLOAD_HANDLERS"];

    })();


    function downloadRequest(request , spider) {

        var scheme = utils.urlparseCached(request).scheme;

        var handler = _get_handler(scheme);


        if (!handler ) {
            throw "Unsupported URL scheme '%s': %s";
        }

        var result = handler.downloadRequest(request , spider);
        return result;
    }
    self.downloadRequest = downloadRequest;


    // ----- private handler -----
    function  _load_handler(scheme) {
        var downloadHandler = null;
        try {
            var dhcls = _schemes[scheme];
            downloadHandler =  new dhcls(_crawler);
            _handlers[scheme] = downloadHandler;
        } catch (e) {
            logger.error(e);
        }
        return downloadHandler;
    }

    function _get_handler(scheme) {
        var handler = _handlers[scheme];

        if (handler) {
            return handler ;
        }

        // --- undefine handler for class ---
        handler = _load_handler(scheme);

        return handler;
    }


}

module.exports.DownloadHandlers = DownloadHandlers;