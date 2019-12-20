const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    },
    prettifier: require('pino-pretty')
});
const superagentInst = require('superagent');
const response = require('../../../http/response')

class EmbbedHttpsDownloadHandler {

    constructor( crawler ) {

        let self = this
        self._crawler = crawler

    }

    downloadRequest(request , spider  , callbacks ) {

        // --- create response object ---
        let agent = new SuperAgent()
        // invoke method handle
        agent.doGet( request , callbacks )
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
    doGet( request , callbacks ) {


        let builder = superagentInst.get( request.getUrl() )

        // --- add header ---
        let headers = request.getHeaders()
        if ( headers ) {
            for (let i in headers ) {
                builder.set(i , headers[i] )
            }
        }


        builder.end( (err, res) => {
                // Calling the end function will send the request
                if (err) {
                    // --- fire call back event ---
                    return
                }

                // --- create new response ---
                let resp = new response.Response( request )
                resp._setStatus( res.statusCode  )
                resp._setHtml( res.text )

                if ( res.headers) {
                    resp._setHeaders( res.headers )
                } else {
                    if ( logger.isLevelEnabled('debug') ) {
                        logger.debug('Return no header from response. ')
                    }
                }

                let successCallback = callbacks['success']
                if (successCallback) {

                    let ref = callbacks['ref']
                    let thisObj = this
                    if (ref) {
                        thisObj = ref
                    }

                    let args = []
                    args.push ( resp  )
                    successCallback.apply( thisObj ,  args )
                }
            })


    }



}




module.exports = EmbbedHttpsDownloadHandler;