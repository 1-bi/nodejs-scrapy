/**
 * 定义新的类内容型式
 */
class CallLaterOnce {

    constructor(func, spider ,engine) {
        let self = this
        self._func = func
        self._spider = spider
        self._engine = engine
        self._call = {
            state : 0 // 0 -> unuse , 1 -> use
        }

        // --- create multiple thread ---
        self._initCreateThread()
    }

    _initCreateThread() {
        let self = this

    }

    /**
     * delay timeout = 200
     * @param delay
     */
    schedule(delay = 0) {
        let self = this
        // call event ---
        if ( !(self._call["fun"] )  ) {
            // --- 使用 Promise 或 异步执行 ---
            setTimeout(function(){
                self._call["state"] = 1;
                self._call["fun"] = self._func.call(self._engine, self._spider)
            },delay);
        }
    }


    cancel() {
        let self = this
        if (self._call["state"]  == 1 && self._call["fun"]   ) {
            self._call["fun"].cancel();
        }
    }
}

module.exports = {
    CallLaterOnce : CallLaterOnce
}
