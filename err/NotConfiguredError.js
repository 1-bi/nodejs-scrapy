const CodeErr = require("../codeerr")

/**
 * build error code
 */
class NotConfiguredError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "NotConfiguredError"
    }
}
module.exports = NotConfiguredError
