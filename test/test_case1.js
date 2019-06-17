const spider = require("./modules/spider");

var array = new Array();
array.push("https://www.baidu.com/");

var spiderSettings = spider.Settings.build();
var spi  = new spider.Splider();
spi.setStartUrls( array );

var crawler = new spider.Crawler(spi , spiderSettings);
crawler.start()