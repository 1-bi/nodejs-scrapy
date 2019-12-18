const request = require('superagent');


class EmbbedHttpsDownloadHandler {

    constructor( crawler ) {

        let self = this
        self._crawler = crawler

    }

    downloadRequest(request , spider) {

        // --- create response object ---
        let agent = new SuperAgent();
        agent.downloadRequest( request  );

        console.log('-----------  EmbbedHttpsDownloadHandler call agent ---')

        return "555";
    }



    close() {

    }


}

/**
 * ================================
 *  define handler implement
 * ================================
 */

function SuperAgent() {

    var self = this;


    function downloadRequest(request ) {

        // --- create response object ---



        return "";
    }
    self.downloadRequest = downloadRequest;
}




module.exports = EmbbedHttpsDownloadHandler;