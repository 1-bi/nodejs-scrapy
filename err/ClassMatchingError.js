const  CodeErr = require("../codeerr")

/**
 * build error code
 */
class ClassMatchingError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "ClassMatchingError"
    }
}


module.exports = ClassMatchingError
