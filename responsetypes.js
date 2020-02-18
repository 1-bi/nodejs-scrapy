const utils = require('./utils')

class ResponseTypes {

    static fromMimetype( mimetype ) {
        let self = this
        let cls = self._classes[mimetype]
        return cls

    }

    static createResponseTypes() {
        let self = this

        self.CLASSES = {
            'text/html': 'http.response.html'

            //'application/atom+xml': 'scrapy.http.XmlResponse',
            //'application/rdf+xml': 'scrapy.http.XmlResponse',
            //'application/rss+xml': 'scrapy.http.XmlResponse',
            //'application/xhtml+xml': 'scrapy.http.HtmlResponse',
            //'application/vnd.wap.xhtml+xml': 'scrapy.http.HtmlResponse',
            //'application/xml': 'scrapy.http.XmlResponse',
            //'application/json': 'scrapy.http.TextResponse',
            //'application/x-json': 'scrapy.http.TextResponse',
            //'application/json-amazonui-streaming': 'scrapy.http.TextResponse',
            //'application/javascript': 'scrapy.http.TextResponse',
            //'application/x-javascript': 'scrapy.http.TextResponse',
            //'text/xml': 'scrapy.http.XmlResponse',
            //'text/*': 'scrapy.http.TextResponse',
        }

        // ---- define classes mapping -----
        self._classes = {}

        // --- load class instance ---
        for (let i in self.CLASSES) {
            let cls = utils.loadObjectCls( self.CLASSES[i] )
            self._classes[i] = cls
        }

        return self
    }

}

module.exports = ResponseTypes.createResponseTypes()