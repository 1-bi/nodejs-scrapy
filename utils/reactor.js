/**
 * 定义新的类内容型式
 */
class CallLaterOnce {

    constructor(func, spider) {
        let self = this
        self._func = func
        self._spider = spider
        self._call = {
            state : 0 // 0 -> unuse , 1 -> use
        }

        // --- create multiple thread ---
        self._initCreateThread()
    }

    _initCreateThread() {
        let self = this

    }

    schedule(delay) {
        let self = this
        // call event ---
        if ( !(self._call["fun"] )  ) {
            // --- 使用 Promise 或 异步执行 ---
            setTimeout(function(){

                self._call["state"] = 1;
                self._call["fun"] = self._func(self._spider)
            },1000);
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
