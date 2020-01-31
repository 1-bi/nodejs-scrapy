const middleware = require('../middleware')
const utils = require("../utils")

/**
 * @class
 */
class ItemPipelineManager extends middleware.MiddlewareManager {

    constructor(middlewares) {
        super(middlewares)
        let self = this
        self._component_name  = "item pipeline"
    }

    processItem(item , spider) {
        let self = this
        self._process_chain("process_item" , item, spider )
    }

    _add_middleware( pipe ) {


    }

    // ---- private method ----
    static  _get_mwlist_from_settings(settings) {

        let result = utils.buildComponentList( )

        return []
    }


}
module.exports = ItemPipelineManager

