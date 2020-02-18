const url = require('url')

function _getBaseUrl( reqUrl  ) {
    let parsedUrl = url.parse( reqUrl )

    let newBaseUrl = parsedUrl.protocol + '//' + parsedUrl.hostname

    if (parsedUrl.port) {
        newBaseUrl += ':'+ parsedUrl.port
    }

    newBaseUrl += parsedUrl.pathname
    return newBaseUrl
}

function getBaseUrl( response ) {

    let url = response._request._get_url()
    return _getBaseUrl( url )
}

module.exports = {
    getBaseUrl  : getBaseUrl
}