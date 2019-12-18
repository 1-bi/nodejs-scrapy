const req = require('../http/request');

/**
 * 解析器，负责解析页面内容，输入是HTML的response，输出是结构化的Items；
 * @constructor
 */
class Spider {


    constructor() {
       let self = this
       self._start_urls = []
    }

    /**
     * 添加初始进入的URLS
     * @param urls
     */
    setStartUrls( urls ) {
        let self = this
        if ( typeof urls  === "string" ) {
            self._start_urls.push( self.makeRequestsFromUrl( urls ) )
        } else if (typeof urls  === "object" && urls instanceof Array) {
            for (var i = 0 ; i < urls.length ; i++) {
                self._start_urls.push( self.makeRequestsFromUrl( urls[i]) )
            }
        }
    }

    makeRequestsFromUrl(url) {
        // url -> mapping , dont_filter = true
        return new req.Request(url, true)
    }

    getStartRequests() {
        return this._start_urls
    }


    /**
     *  get parse rules , 获得可以匹配页面的处理机制
     */
    getRules() {
        let rules = []


        // --- 执行并 parse 不同的逻辑
        return rules
    }
}

module.exports = Spider;



// unuse
function Spider22() {
    var self = this;


    // --- add new quest
    var _start_urls = [];


    function setStartUrls( urls ) {



    }
    self.setStartUrls = setStartUrls;

    function getStartRequests() {
        return _start_urls;
    }
    self.getStartRequests = getStartRequests;

    function  makeRequestsFromUrl(url) {
        // url -> mapping , dont_filter = true
        return new req.Request(url, true);
    }
    self.makeRequestsFromUrl = makeRequestsFromUrl;





    /**
     * 对外发送请求
     * @param url
     * @returns {*}
     */
    function  request(url) {
        var request
        return request;
    }
    self.request = request;


    /**
     * response from page
     * @param response
     */
    function parse(response) {

    }
    self.parse = parse;


    /**
     *  get parse rules , 获得可以匹配页面的处理机制
     */
    function getRules() {
        var rules = [];


        // --- 执行并 parse 不同的逻辑


        return rules;
    }
    self.getRules = getRules;

}