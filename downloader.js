
function Downloader() {

    var self = this;

    var  _middleware = null ;

    function fetch(request, spider) {

        // active_add(request)
        _middleware.download(request, spider);
    }
    self.fetch = fetch ;


    /**
     * 下载中间件业务
     * @param middleware
     */
    function setMiddleware( middleware ) {
        _middleware = middleware;
    }
    selt.setMiddleware = setMiddleware;


}

module.exports.Downloader = Downloader;
