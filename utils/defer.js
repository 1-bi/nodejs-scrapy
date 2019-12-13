// ---- create defere handle ---
const EventEmitter = require('events')

class Deferred extends EventEmitter {

    // update constructor
    constructor( timeout = 1000) {
        super()
        let self = this

        self._errbacks = []
        self._callbacks = []
        self._timeout = timeout
        self._stopSignals = false // --- 没有接收到信号

        self._init()

        self._run()
    }

    _init() {
        let self = this

        self.on('stopAndExist' , function() {
            self._stopSignals = true
        })


    }

    _run() {
        let self = this

        let currentThread = setTimeout(() => {

            if (self._stopSignals) {
                clearTimeout( currentThread )
            } else {
                self._run()
            }

        }, self._timeout)


    }

    addErrback( errback ) {
        let self = this
        self._errbacks.push( errback )
    }

    addCallbacks( callback ) {
        let self = this
        self._callbacks.push( callback )
    }

    addBoth( handler ) {
        let self = this
        self._callbacks.push( handler )
        self._errbacks.push( handler )
    }
    
    callback( result ) {
        let self = this
        self.emit('stopAndExist')
    }

    _startRunCallbacks ( result ) {

    }

    _runCallbacks() {

    }

}


module.exports = {
    Deferred : Deferred
}
