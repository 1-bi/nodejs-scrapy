var pkgScheduler = require('../scheduler');
var queue = require("../queue/memory");
var pipelines = require("../pipelines/itemmanager");
var download = require("../download/downloader");
var pkgDownloadHandler = require("../download/handlers");



function Settings() {

    var self = this ;



    var _scheduler = new pkgScheduler.Scheduler();
    self._scheduler = _scheduler;


    self.properties = {};
    // --- default setting ---
    (function() {

        self.properties["ITEM_PROCESSOR"] = pipelines.ItemPipelineManager;

        self.properties["SCHEDULER_CLASS"] = pkgScheduler.Scheduler;
        self.properties["SCHEDULER_MEMORY_QUEUE"] = queue.Memory;



        self.properties["DOWNLOADER"] = download.Downloader;

        self.properties["DOWNLOAD_HANDLERS"] = {
            'data': {},
            'file': {},
            'http': {},
            'https': pkgDownloadHandler.HttpsDownload
        };

        self.properties["DOWNLOADER_MIDDLEWARES"] = {
        };


        self.properties["CONCURRENT_REQUESTS_PER_DOMAIN"] = 8;
        self.properties["CONCURRENT_REQUESTS_PER_IP"] = 0;
        self.properties["RANDOMIZE_DOWNLOAD_DELAY"] = true;


    })();


    function getScheduler() {
        return self._scheduler;
    }
    self.getScheduler = getScheduler;


    function  getInt(key) {
        var value = self.properties[key];
        if (typeof value === "string") {
            return parseInt(value, 10);
        } else {
            return value ;
        }
    }
    self.getInt = getInt;


}

// ---------- set the default setting configion ----



Settings.maxRetryTimes = function() {

}

Settings.setScheduler = function (scheduler) {
    var _self = this;
    _self._scheduler = scheduler;
}





Settings.build = function() {

    var _self = this;


    var _inst = new Settings();

   return _inst;

}


module.exports = Settings;