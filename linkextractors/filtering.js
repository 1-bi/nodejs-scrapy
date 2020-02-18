

class FilteringLinkExtractor {

    constructor( opts ) {
        let self = this

        if ( typeof(opts['allow']) === 'undefined') {
            // --- accept all
        } else {
            self._allow_res = opts['allow']
        }

        if ( typeof(opts['restrict_xpaths']) === 'undefined') {
            // --- accept all
        } else {
            self._restrict_xpaths = opts['restrict_xpaths']
        }

        if ( typeof(opts['restrict_css']) === 'undefined') {
            // --- accept all
        } else {
            self._restrict_css = opts['restrict_css']
        }
    }


    /**
     * find the url match handle
     * @param url
     * @returns {boolean}
     */
    matches( url ) {
        return true
    }

}

module.exports = FilteringLinkExtractor