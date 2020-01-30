const  CodeErr = require("../codeerr")


class KeyError extends  CodeErr {

    constructor(message , code) {

        super(message , code )
        let self = this
        self.name = "KeyError"
    }
}


module.exports = KeyError