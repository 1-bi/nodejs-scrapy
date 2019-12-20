const {
    isMainThread, parentPort, workerData, threadId,
    MessageChannel, MessagePort, Worker
} = require('worker_threads')

const {Crawler, Spider, Scheduler , Settings} = require('../..')

var array = []
array.push("https://www.baidu.com/")

var spiderSettings = Settings.build()

var spi  = new Spider()
spi.setStartUrls( array )
var c = new Crawler(spi , spiderSettings)

// 启动爬虫动作
let result = c.start()
