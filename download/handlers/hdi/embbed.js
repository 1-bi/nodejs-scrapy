const request = require('superagent');

function EmbbedHttpsDownloadHandler(crawler) {

    var self = this;


    // init function
    (function() {

    })();


    function downloadRequest(request , spider) {

        // --- create response object ---
        var agent = new SuperAgent();
        agent.downloadRequest( request  );

        return "";
    }
    self.downloadRequest = downloadRequest;


    function close() {

    }
    self.close = close ;
}


function SuperAgent() {

    var self = this;


    function downloadRequest(request ) {

        // --- create response object ---



        return "";
    }
    self.downloadRequest = downloadRequest;
}




module.exports = EmbbedHttpsDownloadHandler;