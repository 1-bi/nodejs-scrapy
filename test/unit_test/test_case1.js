const spider = require("../../spiders");
const settings = require("../../settings");
const Crawler = require("../../crawler");

var array = [];
array.push("https://www.baidu.com/");

var spiderSettings = settings.Settings.build();


var spi  = new spider.Spider();
spi.setStartUrls( array );

var c = new Crawler(spi , spiderSettings);

// 启动爬虫动作
c.start();

