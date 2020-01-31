const middleware = require('../middleware')



class SpiderMiddlewareManager extends middleware.MiddlewareManager{

    constructor( middlewares ) {
        super( middlewares )

        let self = this
        self._component_name  = "spider middleware"
    }

    static _get_mwlist_from_settings(settings ) {
        let props = settings.getProperty('SPIDER_MIDDLEWARES_BASE')
        return Object.keys(props)
    }

}


module.exports = SpiderMiddlewareManager