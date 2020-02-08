
function iterateSpiderOutput( result  ) {
    let returnResult  = []

    if (result) {

    } else if (result instanceof Array) {
        returnResult.concat( result )
    } else {
        returnResult.push(result)
    }

    return returnResult
}

module.exports = {
    iterateSpiderOutput  : iterateSpiderOutput
}