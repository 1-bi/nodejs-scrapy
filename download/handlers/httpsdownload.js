const puppeteer = require('puppeteer-core');


function HttpsDownloadHandler(crawler) {

    var self = this;


    // init function
    (function() {

    })();


    function downloadRequest(request , spider) {

        // --- create response object ---
        var agent = new PuppeteerAgent();
        agent.downloadRequest( request  );

        return "";
    }
    self.downloadRequest = downloadRequest;


    function close() {

    }
    self.close = close ;
}


function PuppeteerAgent() {

    var self = this;


    function downloadRequest(request ) {

        // --- create response object ---

        (async () => {

            const browser = await puppeteer.launch({headless:false,

                devtools: true,

                executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'});

            //const browser = await puppeteer.launch({headless:false, devtools: true, args: ['--remote-debugging-port=9222'] } );

            const page = await browser.newPage();
            await page.goto('https://www.baidu.com');
            await page.screenshot({path: 'example.png'});

            await browser.close();
        })();

        return "";
    }
    self.downloadRequest = downloadRequest;
}




module.exports = HttpsDownloadHandler;