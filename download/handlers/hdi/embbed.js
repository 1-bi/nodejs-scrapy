const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    },
    prettifier: require('pino-pretty')
});
const superagentInst = require('superagent');
const response = require('../../../http/response')
const utils = require("../../../utils")
const ResponseTypes = require('../../../responsetypes')

class EmbbedHttpsDownloadHandler {

    constructor( crawler ) {
        let self = this
        self._crawler = crawler
    }

    downloadRequest(request , spider , _deferred ) {


        // --- create response object ---
        let agent = new SuperAgent()
        // invoke method handle
        let defer = agent.doGet( request , _deferred )

        return defer
    }

    close() {

    }


}

/**
 * ================================
 *  define handler implement
 * ================================
 */
class SuperAgent {

    downloadRequest(request ) {
        let self = this

        // --- create response object ---

        return "";
    }


    /**
     * define get from request
     * @param request
     */
    doGet( request , _deferred) {

        let builder = superagentInst.get( request.getUrl() )

        // --- add header ---
        let headers = request.getHeaders()
        if ( headers ) {
            for (let i in headers ) {
                builder.set(i , headers[i] )
            }
        }

        // --- create defer object ---
        let defer = _deferred
        builder.then( (res) => {
            //do something
            // --- create new response ---
            let respCls = ResponseTypes.fromMimetype( res.headers['content-type'] )
            let resp = new respCls( request  )
            resp._setStatus( res.statusCode  )
            resp._setHtml( res.text )

            if ( res.headers) {
                resp._setHeaders( res.headers )
            } else {
                if ( logger.isLevelEnabled('debug') ) {
                    logger.debug('Return no header from response. ')
                }
            }

            // buile response
            resp.buildResponse( res  )

            // --- call back defer ---
            defer.callback( resp )
        }).catch( (err) => {
            //do something
            defer.errback( err )

        }).finally((result) => {

        })

        return defer
    }
}




module.exports = EmbbedHttpsDownloadHandler;