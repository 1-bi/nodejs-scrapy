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

    downloadRequest(request , spider) {

        // --- create response object ---
        let agent = new SuperAgent()
        agent.doGet( request  )

        return "555";
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
    doGet( request  ) {

        superagentInst.get( request.getUrl() )
            .end( (err, res) => {
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







            })
       //logger.info("hemo")


    }



}




module.exports = EmbbedHttpsDownloadHandler;