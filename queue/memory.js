var Queue = require('better-queue');


function Memory() {


    var self = this ;

    var queue = [];

    function pop() {
        return queue.pop();
    }
    self.pop = pop;


    function push(queueObj) {
        queue.push( queueObj );
    }
    self.push = push;



}

module.exports.Memory = Memory;

