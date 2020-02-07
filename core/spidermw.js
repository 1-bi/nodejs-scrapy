const middleware = require('../middleware')
const utils = require('../utils')


class SpiderMiddlewareManager extends middleware.MiddlewareManager{

    constructor( middlewares ) {
        super( middlewares )

        let self = this
        self._component_name  = "spider middleware"
    }


    scrapeResponse( scrape_func, response, request, spider ) {

        function process_spider_input( response ) {
            return scrape_func(response, request, spider)
        }

        let dfd = utils.mustbeDeferred( process_spider_input(response) )
        //dfd.addCallbacks(callback=process_spider_output, errback=process_spider_exception)
        return dfd

    }


    static _get_mwlist_from_settings(settings ) {
        let props = settings.getProperty('SPIDER_MIDDLEWARES_BASE')
        return Object.keys(props)
    }

}


module.exports = SpiderMiddlewareManager