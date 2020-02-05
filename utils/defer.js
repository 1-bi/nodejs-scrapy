// ---- create defere handle ---
const EventEmitter = require('events')
const Promise = require("bluebird")
const err = require('../err')

class Deferred extends EventEmitter {

    // update constructor
    constructor( timeout = 1000) {
        super()
        let self = this

        self._errbacks = []
        self._callbacks = []
        self._timeout = timeout
        self._init()

    }

    _init() {
        let self = this

        self.on('stopAndExist' , function() {
            self._stopSignals = true
        })

    }


    addErrback( errback ) {
        let self = this
        self._errbacks.push( errback )
        return self
    }

    addCallback(callback ) {
        let self = this
        self._callbacks.push( callback )
        return self
    }

    addCallbacks( callbacks ) {
        let self = this
        self._callbacks.concat( callbacks )
        return self
    }

    addBoth( handler ) {
        let self = this
        self._callbacks.push( handler )
        self._errbacks.push( handler )
        return self
    }
    
    callback( result ) {
        let self = this

        self._startRunCallbacks( result ,self._callbacks )


        return self
    }

    chainDeferred( dfd ) {
        let self = this

        /**
         *         """
         Chain another L{Deferred} to this L{Deferred}.
         This method adds callbacks to this L{Deferred} to call C{d}'s callback
         or errback, as appropriate. It is merely a shorthand way of performing
         the following::
         self.addCallbacks(d.callback, d.errback)
         When you chain a deferred d2 to another deferred d1 with
         d1.chainDeferred(d2), you are making d2 participate in the callback
         chain of d1. Thus any event that fires d1 will also fire d2.
         However, the converse is B{not} true; if d2 is fired d1 will not be
         affected.
         Note that unlike the case where chaining is caused by a L{Deferred}
         being returned from a callback, it is possible to cause the call
         stack size limit to be exceeded by chaining many L{Deferred}s
         together with C{chainDeferred}.
         @return: C{self}.
         @rtype: a L{Deferred}
         """
         d._chainedTo = self
         return self.addCallbacks(d.callback, d.errback)
         */
        if (!dfd instanceof Deferred) {
            let errMsg = 'Class [Deferred] is not matching instance'
            throw new err.ClassMatchingError( errMsg )
        }

        self._callbacks.concat( dfd._callbacks )
        self._errbacks.concat( dfd._errbacks )

        return self

    }

    /**
     *
     * @param err Error
     */
    errback(err) {
        let self = this

        self._startRunCallbacks( self , self._errbacks)
        return self
    }


    // -------- status call back
    _startRunCallbacks ( result , callbacks) {
        let self = this

        return self._runCallbacks( result , callbacks )
    }

    _runCallbacks( result , callbacks  ) {
        let self = this

        // ---- get call back ---
        let promise = new Promise(function( resolve , reject ) {
            try {
                let returVal = result
                resolve( returVal )
            } catch (err) {
                reject( err )
            } finally {

            }

        })
        // --- check the callback function ---
        for (let i = 0 ; i < callbacks.length ; i++) {
            promise.then( callbacks[i] )
        }


        // --- check the callback function ---
        /*
        for (let i = 0 ; i < self._errbacks.length ; i++) {
            promise.catch( self._errbacks[i] )
        }
         */
    }

}


module.exports = {
    Deferred : Deferred
}
