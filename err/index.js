const ClassMatchingError = require('./ClassMatchingError')
const KeyError = require('./KeyError')
const IllegalArguementError = require('./IllegalArguementError')
const NotImplmentError = require('./NotImplmentError')
const NotConfiguredError = require('./NotConfiguredError')
const UnsupportedUrlSchemeError = require('./UnsupportedUrlSchemeError')
const NotbeDeferError = require('./NotbeDeferError')


module.exports = {
    IllegalArguementError: IllegalArguementError,
    ClassMatchingError : ClassMatchingError,
    NotConfiguredError: NotConfiguredError,
    NotImplmentError : NotImplmentError,
    NotbeDeferError: NotbeDeferError,
    UnsupportedUrlSchemeError: UnsupportedUrlSchemeError,
    KeyError : KeyError
};