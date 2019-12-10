/**
 * define class
 * @param url
 * @constructor
 */
function Request(url) {

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


    function  getUrl(){
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

module.exports.Request = Request
