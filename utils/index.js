const url = require('url')
const reactor = require('./reactor')
const defer = require('./defer')


// ---- create defere handle

function  deferSucceed(result) {

    var successDefer = new defer.Deferred()
    successDefer.addCallbacks( result )

    return successDefer;

};

function deferFail(_failure) {
    let d = new defer.Deferred()
    d.addErrback( _failure )
    return d
}

function deferResult(result) {
    // --- check instance of error ---
    if (result instanceof Error ) {
        return deferFail(result);
    } else {
        return deferSucceed(result);
    }


};


function isFunctionC(object) {
    return !!(object && object.constructor && object.call && object.apply);
}





function mustbeDeferred(func , args ) {
    // --- create defered hanlde --
    let returnObj = {}
    try {
        let  result = func(args);
        returnObj = deferResult(result)
    } catch (e) {
        if ( e instanceof Error) {
            returnObj = deferFail(e)
        } else {
            let  err = new Error(e)
            returnObj = deferFail(err)
        }
    }
    return returnObj;

}


function urlparseCached(request) {
    /**
     Return urlparse.urlparse caching the result, where the argument can be a
     Request or Response object
     * @type {number | any}
     */
    var urlObj = url.parse( request.getUrl() );

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
    let clsObj = require(fullFilePath )

    if (!clsObj) {
        throw new ClassNotFoundError("Could not find class in file path [" + fullFilePath + "]. ")
    }

    return clsObj
}



module.exports = {
    Deferred : defer.Deferred ,
    mustbeDeferred  : mustbeDeferred ,
    isFunctionC : isFunctionC,
    loadObjectCls : loadObjectCls,
    urlparseCached : urlparseCached ,
    CallLaterOnce : reactor.CallLaterOnce
};
