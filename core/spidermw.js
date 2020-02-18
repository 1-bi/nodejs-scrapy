const middleware = require('../middleware')
const utils = require('../utils')


class SpiderMiddlewareManager extends middleware.MiddlewareManager{

    constructor( middlewares ) {
        super( middlewares )

        let self = this
        self._component_name  = "spider middleware"
    }


    scrapeResponse( scrape_obj, response, request, spider ) {

        function process_spider_input( response ) {

            let callObj = scrape_obj['ref']
            let callbackFn = scrape_obj['fn']

            let args = []
            args.push(response)
            args.push(request)
            args.push(spider)
            return callbackFn.apply(callObj , args)
        }

        let dfd = utils.mustbeDeferred( process_spider_input(response) )
        //dfd.addCallbacks(callback=process_spider_output, errback=process_spider_exception)
        return dfd

    }

    processStartRequests( startRequests, spider ) {
        let self = this
        let reqs = self._process_chain('process_start_requests', start_requests, spider)
        return reqs

    }


    static _get_mwlist_from_settings(settings ) {
        let props = settings.getProperty('SPIDER_MIDDLEWARES_BASE')
        return Object.keys(props)
    }

}


module.exports = SpiderMiddlewareManager