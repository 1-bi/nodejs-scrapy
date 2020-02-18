const uril = require('util')

class Link {

    constructor(url, text='', fragment='', nofollow=false) {
        if ( typeof(url) != 'string' ) {
            let msg = util.format("Link urls must be string type")
            throw new Error(msg )
        }

        let self = this
        self._url = url
        self._text = text
        self._fragment = fragment
        self._nofollow = nofollow
    }
}

module.exports = Link
