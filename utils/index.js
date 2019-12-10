const url = require('url');

// ---- create defere handle
function Deferred() {

    var self = this;

    var _errbacks = [];
    var _callbacks = [];

    function addErrback(errback) {
        _errbacks.push(errback);
    }
    self.addErrback = addErrback;

    function addCallbacks(callback) {
        _callbacks.push(callback);
    }
    self.addCallbacks = addCallbacks;

    function addBoth(handler) {
        _callbacks.push(handler);
        _errbacks.push(handler);
    }
    self.addBoth = addBoth;

}


function  deferSucceed(result) {

    var successDefer = new Deferred();
    successDefer.addCallbacks( result );

    return successDefer;

};

function deferFail(_failure) {
    var defer = new Deferred();
    defer.addErrback( _failure );
    return defer ;
}

function deferResult(result) {

    // --- check instance of error ---
    if (result instanceof Error ) {
        return deferFail(result);
    } else {
        return deferSucceed(result);
    }


};


function mustbeDeferred(func , args ) {
    // --- create defered hanlde --
    var returnObj = {};
    try {
        var result = func(args);
        returnObj = deferResult(result);
    } catch (e) {
        if ( e instanceof Error) {
            returnObj = deferFail(e);
        } else {
            var err = new Error(e);
            returnObj = deferFail(err);
        }
    }
    return returnObj;

}


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
    }


    async schedule(delay) {
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

/**
 * unuse
 * @param func
 * @param spider
 * @constructor
 */
function CallLaterOnce2( func , spider ) {

    var self = this;

    var _func = func ;

    var _spider = spider ;

    var _call = {
        state : 0 // 0 -> unuse , 1 -> use
    };

    function schedule() {

        // call event ---
        if ( !(_call["fun"] )  ) {

            // --- 使用 Promise 或 异步执行 ---


            setTimeout(function(){
                _call["state"] = 1;
                _call["fun"] = _func(spider);
            },1000);
        }

    }
    self.schedule = schedule;

    function cancel() {

        if (_call["state"]  == 1 && _call["fun"]   ) {
            _call["fun"].cancel();
        }

    }
    self.cancel = cancel;

    // --- up caller ---
}


function urlparseCached(request) {
    /**
     Return urlparse.urlparse caching the result, where the argument can be a
     Request or Response object
     * @type {number | any}
     */
    var urlObj = url.parse(request.getUrl() );

    var parseCache = {
        scheme : urlObj.protocol.replace(":",""),
        host: urlObj.host,
        hostname: urlObj.hostname,
        query: urlObj.query,
        pathname: urlObj.pathname
    };
    return parseCache;

}

function UndefinedError(message) {
    this.name = 'UndefinedError';
    this.message = message || 'Default Error Message';
}

function ClassNotFoundError(message) {
    this.name = 'ClassNotFoundErrorError';
    this.message = message || 'Default Error Message';
}


function loadObjectCls(inputCls) {
    if ( !inputCls ) {
        throw new UndefinedError('Class loaded is undefined. ')
    }

    let filePath = inputCls.split(".").join("/")
    let fullFilePath = "../" +filePath
    let  clsObj = require(fullFilePath )

    if (!clsObj) {
        throw new ClassNotFoundError("Could not find class in file path [" + fullFilePath + "]. ")
    }

    return clsObj
}



module.exports = {
    Deferred : Deferred ,
    mustbeDeferred  : mustbeDeferred ,
    loadObjectCls : loadObjectCls,
    urlparseCached : urlparseCached ,
    CallLaterOnce : CallLaterOnce
};
