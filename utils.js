


function CallLaterOnce() {

    var self = this;

    function schedule() {

    }
    self.schedule = schedule;

    function cancel() {

    }
    self.cancel = cancel;



}



module.exports = {
    CallLaterOnce : CallLaterOnce
};