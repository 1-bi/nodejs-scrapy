/**
 *  统一标准的调度器，负责对请求建立统一调度管理模型，默认为本地定义调度器
 *  调度器负责存放需要下载的请求记录
 *  默认该类为基本本地的服务调度器
 * @constructor
 */
class EmbbedScheduler {


    constructor(){
        let self = this
        self._init()
    }

    _init() {
        let self = this
        self._mqclass = {}
    }


    open( spider ) {
        let self = this

        // 创建关联MQ
        self.mqs = self._mq()
        self._spider = spider
    }

    close( reason ) {

    }


    enqueueRequest(request) {
        let self = this
        // --- push request to queue ---
        self._mqpush(request)
    }


    nextRequest() {
        let self = this
        let request = self.mqs.pop()

        if (request) {
            // --- add state count
        }
        return request
    }


    hasPendingrequests() {
        let self = this
        // ---- check the request in mqs ---
        return self.mqs.length() > 0

    }


    // ----- private method ---
    /**
     * " Create a new priority queue instance, with in-memory storage "
     * 创建 reqeust  mq 队列
     * @private
     */
    _mq() {
        let self = this
        let  mqInst = self._newmq()
        return mqInst
    }


    _newmq() {
        let self = this
        return new self._mqclass()
    }

    _mqpush(reqs) {
        let self = this

        if (reqs instanceof Array) {
            self.mqs.pushAll(reqs)
        } else {
            self.mqs.push(reqs)
        }

        //self.mqs.push( reqs )
        // --- set priority ---
    }


    static fromCrawler( crawler ) {
        let settings = crawler.getSettings()

        let inst = new EmbbedScheduler()
        inst._mqclass = settings.getProperty('SCHEDULER_MEMORY_QUEUE')
        return inst
    }


}

module.exports = EmbbedScheduler