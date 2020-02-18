const url = require('url')
const reactor = require('./reactor')
const defer = require('./defer')
const err = require('../err')


function isFunctionC(object) {
    return !!(object && object.constructor && object.call && object.apply);
}


function lengthSetObj( object ) {
    let counter = 0
    for (let i in object ) {
        counter = counter + 1
    }
    return counter
}


function urlparseCached(request) {
    /**
     Return urlparse.urlparse caching the result, where the argument can be a
     Request or Response object
     * @type {number | any}
     */
    let  urlObj = url.parse( request.getUrl() )
    let parseCache = {
        scheme : urlObj.protocol.replace(":",""),
        host: urlObj.host,
        hostname: urlObj.hostname,
        query: urlObj.query,
        pathname: urlObj.pathname
    }

    return parseCache

}

function UndefinedError(message) {
    this.name = 'UndefinedError';
    this.message = message || 'Default Error Message';
}

function ClassNotFoundError(message) {
    this.name = 'ClassNotFoundErrorError';
    this.message = message || 'Default Error Message';
}


function loadObjectCls(inputCls ) {


    if ( !inputCls ) {
        throw new UndefinedError('Class loaded is undefined. ')
    }
    let filePath = inputCls.split(".").join("/")

    let fullFilePath = "../"
    fullFilePath = fullFilePath + filePath
    let clsObj = require(fullFilePath )

    if (!clsObj) {
        throw new ClassNotFoundError("Could not find class in file path [" + fullFilePath + "]. ")
    }

    return clsObj
}


function buildComponentList( compdict, custom=null , convert="" ) {

}


function deferSuccess( result ) {
    //  Same as twisted.internet.defer.succeed but delay calling callback until next reactor loop

}

/**
 * create defere result
 * @param result
 */
function deferResult(  result ) {

    if (result instanceof defer.Deferred ) {
        return result
    }
    else if ( result instanceof Error    ) {
        let d = new defer.Deferred( 0  )
        setTimeout(function() {
            d.errback( result )
        },0)
        return d

    } else {
        // --- create new defer ---
        let d = new defer.Deferred( 0  )
        setTimeout(function() {
            d.callback( result )
        },0)
        return d
    }

}

function arraySpiderOutput( result  ) {
    return argToArray( result  )
}


function argToArray( arg ) {

    if (!arg) {
        return []
    } else if (arg instanceof  Array ) {
        return arg
    } else {
        return [arg]
    }

}


function parseBoolean (string) {
    var bool;
    bool = (function() {
        switch (false) {
            case string.toLowerCase() !== 'true':
                return true;
            case string.toLowerCase() !== 'false':
                return false;
        }
    })();
    if (typeof bool === "boolean") {
        return bool;
    }
    return void 0;
}


function mustbeDeferred( dfd  ) {
    if ( typeof(dfd) == 'undefined' || ! dfd instanceof defer.Deferred) {
        let msg = "The class provided is not a 'defer.Deferred',please check it."
        throw new err.NotbeDeferError(msg)
    }
    return dfd
}


function urljoin(preurl , appendurl) {

    let tmpUrl = new URL( preurl )

    let renewTmp = tmpUrl.protocol + '//' + tmpUrl.host

    if ( tmpUrl.port ) {
        renewTmp = renewTmp + ':' + tmpUrl.port
    }

    if ( appendurl.startsWith('/') ) {
        renewTmp = renewTmp + appendurl
    }
    else {

        throw new Error('message error ')

    }


    return renewTmp
}


module.exports = {
    Deferred : defer.Deferred ,
    mustbeDeferred  : mustbeDeferred ,
    isFunctionC : isFunctionC,
    loadObjectCls : loadObjectCls,
    urlparseCached : urlparseCached ,
    lengthSetObj : lengthSetObj,
    buildComponentList: buildComponentList,
    deferResult: deferResult,
    arraySpiderOutput: arraySpiderOutput,
    parseBoolean: parseBoolean,
    CallLaterOnce : reactor.CallLaterOnce,
    urljoin: urljoin
};
