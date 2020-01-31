const err = require('../err')


class SpiderLoader {

    constructor(settings) {
        let self = this

        self._spiderModules = settings.getProperty("SPIDER_MODULES")
        self._spider = {}
        self._loader_all_spiders()
    }


    /**
     *  Return the Spider class for the given spider name. If the spider name is not found, raise a KeyError.
     *
     * @param spiderName
     */
    load(spiderName) {
        try {

        } catch (e) {
            throw new err.KeyError( util.format('Spider not found: %s', spider_name) )
        }


    }


    // ----------- private method -------------------

    _load_spiders(module) {

    }


    _load_all_spiders() {

    }

}

module.exports = SpiderLoader