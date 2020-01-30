
const {Crawler,CrawlerProcess,  Spider, Scheduler , Settings} = require('../..')

var array = []
array.push("https://www.baidu.com/")

var spiderSettings = Settings.build()

var spi  = new Spider()
spi.setStartUrls( array )


let process = new CrawlerProcess({

})

//var c = new Crawler('spiders.spider' , spiderSettings)

// 启动爬虫动作
let result = c.start()
