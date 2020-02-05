const CodeErr = require("../codeerr")

/**
 * build error code
 */
class NotbeDeferError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "NotbeDeferError"
    }
}
module.exports = NotbeDeferError
