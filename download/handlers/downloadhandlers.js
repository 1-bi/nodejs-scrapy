const pino = require('pino');
const utils = require("../../utils")
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
})

/**
 * define download handlers
 */
class DownloadHandlers {

    constructor( crawler ) {
        let self = this

        self._crawler = crawler

        self._schemes = {}  // stores acceptable schemes on instancing

        self._handlers = {} // stores instanced handlers for schemes

        self._schemes = crawler.getSettings().getProperty("DOWNLOAD_HANDLERS")

    }

    downloadRequest( request , spider ) {
        let self = this

        let scheme = utils.urlparseCached(request).scheme

        let handler = self._get_handler(scheme);


        if (!handler ) {
            throw "Unsupported URL scheme '%s': %s"
        }

        let result = handler.downloadRequest(request , spider)
        return result
    }

    // ----- private handler -----
    _load_handler(scheme) {
        let  downloadHandler = null
        try {
            var dhcls = _schemes[scheme]
            downloadHandler =  new dhcls(_crawler)
            _handlers[scheme] = downloadHandler
        } catch (e) {
            logger.error(e)
        }
        return downloadHandler
    }

    /**
     * get load instance
     * @param scheme
     * @returns {*}
     * @private
     */
    _get_handler(scheme) {
        let self = this

        let handler = self._handlers[scheme]

        if (handler) {
            return handler
        }

        // --- undefine handler for class ---
        handler = self._load_handler(scheme)

        return handler
    }

}

module.exports.DownloadHandlers = DownloadHandlers
