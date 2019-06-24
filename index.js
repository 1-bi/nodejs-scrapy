var crawler = require('./crawler');
var splider = require('./spiders/spider');
var scheduler = require('./scheduler');
var settings = require('./settings/settings');


module.exports = {
    Crawler : crawler.Crawler,
    Splider: splider.Splider,
    Scheduler: scheduler.Scheduler,
    Settings: settings.Settings
};


