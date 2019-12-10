const puppeteer = require('puppeteer-core');


function PuppeteerHttpsDownloadHandler(crawler) {

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

    var _puppeterrConfig = {
        headless : false ,
        devtools :  true ,
        executablePath  : 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    };


    function downloadRequest(request ) {

        // --- create response object ---

        (async () => {

            const browser = await puppeteer.launch({headless:_puppeterrConfig["headless"],
                devtools: _puppeterrConfig["devtools"],
                executablePath: _puppeterrConfig["executablePath"]});
            //const browser = await puppeteer.launch({headless:false, devtools: true, args: ['--remote-debugging-port=9222'] } );

            // ---- execute script from js source ---


            const page = await browser.newPage();
            await page.goto('https://www.baidu.com');
            await page.screenshot({path: 'example.png'});

            await browser.close();
        })();


        return "";
    }
    self.downloadRequest = downloadRequest;
}




module.exports = PuppeteerHttpsDownloadHandler;