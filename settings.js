var pkgScheduler = require('./scheduler');
var queue = require("./queue/memory");
var pipelines = require("./pipelines/itemmanager");
var download = require("./download/downloader");



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
            'https': {}
        };

        self.properties["DOWNLOADER_MIDDLEWARES"] = {
        };







    })();


    function getScheduler() {
        return self._scheduler;
    }
    self.getScheduler = getScheduler;

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


module.exports.Settings = Settings;