/**
 * 解析器，负责解析页面内容，输入是HTML的response，输出是结构化的Items；
 * @constructor
 */
function Spider() {
    var self = this;



    var _start_urls = [];

    /**
     * 添加初始进入的URLS
     * @param urls
     */
    function setStartUrls( urls ) {

        if ( typeof urls  === "string" ) {
            _start_urls.push( urls);
        } else if (typeof urls  === "object" && urls instanceof Array) {
            _start_urls.push.apply(_start_urls, urls);
        }

    }
    self.setStartUrls = setStartUrls;

    function getStartRequests() {
        return _start_urls
    }
    self.getStartRequests = getStartRequests;



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
module.exports.Splider = Spider;