/**
 *  统一标准的调度器，负责对请求建立统一调度管理模型，默认为本地定义调度器
 *  调度器负责存放需要下载的请求记录
 * @constructor
 */

function Scheduler() {


    var self = this;


    self._mqclass = {};

    var _spider  = null;


    function open(spider) {
        _spider = spider ;


        // 创建关联MQ
        self.mqs = _mq();


    }
    self.open = open;

    function close(reason) {

    }
    self.close = close ;

    function enqueueRequest(request) {
        // --- push request to queue ---
        _mqpush(request);
    }
    self.enqueueRequest = enqueueRequest ;

    function nextRequest() {


        var request = self.mqs.pop();

        if (request) {
            // --- add state count
        }


        return request ;

    }
    self.nextRequest = nextRequest;


    // ----- private method ---
    /**
     * " Create a new priority queue instance, with in-memory storage "
     * 创建 reqeust  mq 队列
     * @private
     */
    function _mq() {
        var mqInst = _newmq();
        return _newmq();
    }


    function _newmq() {
        return new self._mqclass();
    }

    function _mqpush(request) {

        self.mqs.push(request);
        // --- set priority ---
    }

}


/**
 *  create new instance from crawler
 * @param crawler
 */
Scheduler.fromCrawler = function(crawler) {
    var settings = crawler.getSettings()

    var inst = new Scheduler()
    inst._mqclass = settings.getProperty('SCHEDULER_MEMORY_QUEUE')

    return inst;
}



module.exports.Scheduler = Scheduler;