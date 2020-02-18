const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
})
const linkextractors = require('../linkextractors')

class CrawlRule {


    constructor( link_extractor , callback , errback , cb_kwargs , process_links , process_request , follow = true ) {
        let self = this

        if ( typeof(link_extractor) === 'undefined' ) {
            self._link_extractor = new linkextractors.LinkeExtractor()
        } else {
            self._link_extractor = link_extractor

        }

        self._callback = callback
        self._errback = errback
        self._cb_kwargs = cb_kwargs

        // 指定该spider中哪个的函数将会被调用，从link_extractor中获取到链接列表时将会调用该函数。该方法主要用来过滤
        self._process_links = process_links

        // 指定该spider中哪个的函数将会被调用， 该规则提取到每个request时都会调用该函数。 (用来过滤request)
        self._process_request = process_request
        self._process_request_argcount = null
        self._follow = follow
    }

    getLinkExtractor() {
        let self = this
        return self._link_extractor
    }


    _compile( spider ) {
        let self = this
        if ( self.process_request_argcount == 1) {
            let msg = 'Rule.process_request should accept two arguments (request, response)'
            logger.warn( msg )
        }
        self._process_request = self._get_method( self._process_request  , spider )
    }

    processRequest(request, response) {
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


    _get_method(method, spider) {
        let defaultFunction = function() {

        }

        if ( typeof( method ) === 'function') {
            return method
        } else if ( typeof( method ) === 'string' )  {
            if ( typeof( spider[method] ) === 'function'  ) {
                return spider[method]
            }
        }
        return defaultFunction

    }



}


module.exports = CrawlRule