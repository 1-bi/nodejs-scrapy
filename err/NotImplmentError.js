const CodeErr = require("../codeerr")

/**
 * build error code
 */
class NotImplementError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "NotImplementError"
    }
}


module.exports = NotImplementError
