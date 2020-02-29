var Queue = require('better-queue');

class Memory {


    constructor(){
        let self = this

        self._queue = []

        self._init()
    }

    _init() {

    }

    pop() {
        let self = this
        return self._queue.pop()
    }

    push( queueObj ) {
        let self = this
        self._queue.push( queueObj )
    }

    pushAll ( objArray ) {
        let self = this
        self._queue = self._queue.concat( objArray )
    }

    length() {
        let self = this
        return self._queue.length
    }


}

module.exports.Memory = Memory;

