const pino = require('pino')
const logger = pino({
    prettyPrint: {
        levelFirst: true
    }
})


class SignalManager {

    /**
     *
     * @param spidercls
     * @param sender
     */
    constructor(spidercls ,  sender = null) {
        let self = this
        self.sender = sender
    }

    /**
     * Connect a receiver function to a signal.
     * The signal can be any object, although Scrapy comes with some
     * predefined signals that are documented in the :ref:`topics-signals`
     * section.
     * :param receiver: the function to be connected
     * :type receiver: callable
     * :param signal: the signal to connect to
     * :type signal: object
     *
     *
     */
    connect( receiver , signal , kwargs ) {


    }

    /**
     * Disconnect a receiver function from a signal. This has the
     * opposite effect of the :meth:`connect` method, and the arguments
     * are the same.
     *
     *
     */
    disconnect( receiver , signal , kwargs ) {
    }

    /**
     *      Send a signal, catch exceptions and log them.
     * The keyword arguments are passed to the signal handlers (connected
     * through the :meth:`connect` method).
     *
     */
    sendCatchLog(signal , kwargs) {

        logger.info(signal.msg + " [ " + kwargs.getUrl() + " ] " )


    }

    /**
     *
     * Like :meth:`send_catch_log` but supports returning
     * :class:`~twisted.internet.defer.Deferred` objects from signal handlers.
     * Returns a Deferred that gets fired once all signal handlers
     * deferreds were fired. Send a signal, catch exceptions and log them.
     * The keyword arguments are passed to the signal handlers (connected
     * through the :meth:`connect` method).
     *
     */
    sendCatchLogDefferred( signal , kwargs) {

    }

    disconnectAll( signal, kwargs) {

    }

}

module.exports = SignalManager