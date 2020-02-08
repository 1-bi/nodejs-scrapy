const Spider = require('spider')
const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
})

class CrawlRule {


    constructor( link_extractor ) {
        let self = this

        self._link_extractor = link_extractor
        self._callback = callback
        self._errback = errback
        self._cb_kwargs = cb_kwargs
        self._process_links = process_links
        self._process_request = process_request
        self._process_request_argcount = null
        self._follow = follow
    }


    _compile( spider ) {
        let self = this
        if ( self.process_request_argcount == 1) {
            let msg = 'Rule.process_request should accept two arguments (request, response)'
            logger.warn( msg )
        }
    }

    _process_request(request, response) {
        let self = this
        let args = {}
        if ( self.process_request_argcount === 1  ) {
            args['request'] = request
        } else {
            args['request'] = request
            args['response'] = response
        }
        return  self._process_request(args['request'] , args['response'])
    }




}


module.exports = CrawlRule