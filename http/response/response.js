
class  Response {

    /**
     * build response object from request -
     * @param request
     */
    constructor( request ) {
        let self = this

        self._request = request
        self._status = -1
        self._headers = {}
    }

    getHtml() {
        let self = this
        return self._html
    }

    getHeaders() {
        let self = this
        return self._headers
    }

    getStatus() {
        let self = this
        return self._statusCode
    }

    _setHtml( htmlText ) {
        let self = this
        self._html = htmlText
        return self
    }

    _setHeaders( headers ) {
        let self = this
        self._headers = headers
        return self
    }

    _setStatus( statusCode ) {
        let self = this
        self._statusCode = statusCode
        return self
    }


}

module.exports.Response = Response;