const CodeErr = require("../codeerr")

/**
 * build error code
 */
class UnsupportedUrlSchemeError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "UnsupportedUrlSchemeError"
    }
}


module.exports = UnsupportedUrlSchemeError
