const spider = require("..");


var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');
        resolve('随便什么数据');
    }, 2000);
});

var array = new Array();
array.push("https://www.baidu.com/");

var spiderSettings = spider.Settings.build();
var spi  = new spider.Splider();
spi.setStartUrls( array );

var crawler = new spider.Crawler(spi , spiderSettings);

// 启动爬虫动作
crawler.start();

