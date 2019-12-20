const farmhash = require('farmhash')

/**
 * define class
 * @param url
 * @constructor
 */
class Request {

    constructor( url ) {
        let self = this
        self._encoding =  "UTF-8"
        self._method = "GET"

        self._set_url(url)

        self._cookies = {}

        self._headers = {}

        self._meta = {}

        self._flags = []

    }

    _init() {

    }

    meta() {
        let self = this
        if (!self._meta) {
            self._meta = {}
        }
        return self._meta
    }

    getUrl() {
        let self = this
        return self._get_url()
    }

    getReqHash() {
        let self = this
        return self._hash
    }

    setHeaders( headers ) {
        let self = this
        self._headers = headers
        return self
    }

    getHeaders() {
        let self = this
        return self._headers
    }


    _set_url(url) {
        let self = this
        self._url = url

        // --- set the hash key
        self._hash = farmhash.hash32( Buffer.from(  url )  )
        return self._url
    }

    _get_url() {
        let self = this
        return self._url
    }



}

module.exports.Request = Request

/**
 * unuse
 * @param url
 * @constructor
 */
function Request2(url) {

    var self = this

    // --- default value ---
    var _encoding = "UTF-8";

    var _method = "GET";

    // ---redefine url ---
    var _url = _set_url(url)


    var _cookies = {}

    var headers = {}

    var _meta = {}

    var _flags = []


    //   --- get method info --
    function meta() {
        if (!_meta) {
            _meta = {}
        }
        return _meta
    }
    self.meta = meta

    // --- replase url
    function copy() {
        return
    }


    function getUrl(){
        return _get_url()
    }
    self.getUrl = getUrl


    // ---- private url ---
    function  _set_url(url) {
        _url = url
        return _url
    }

    function _get_url() {
        return _url
    }

}
