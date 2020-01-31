/**
 * build error code
 */
class CodeErr extends Error {

     constructor(message , code) {

         super()

         let self = this
         self.message = self._buildCodeMsg(message , code )
         self.name = "CodeErr"
     }

    /**
     * build message
     * @param message
     * @param code
     * @private
     */
     _buildCodeMsg( message , code  ) {
        let self = this

        let errMsg = ""
        if (code) {
            errMsg = "[" + code +"] "
            self.code = code
        }
        errMsg = errMsg + message
        return errMsg
     }


}

module.exports = CodeErr