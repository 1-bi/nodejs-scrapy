


function CallLaterOnce( func , spider ) {

    var self = this;

    var _func = func ;

    var _spider = spider ;

    function schedule() {
        // call event ---
        if (_func) {
            _func(spider);
        }

    }
    self.schedule = schedule;

    function cancel() {

    }
    self.cancel = cancel;

    // --- up caller



}



module.exports = {
    CallLaterOnce : CallLaterOnce
};