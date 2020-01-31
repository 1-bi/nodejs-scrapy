const  CodeErr = require("../codeerr")

/**
 * build error code
 */
class IllegalArguementError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "IllegalArguementError"
    }
}


module.exports = IllegalArguementError
