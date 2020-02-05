
const {Crawler,CrawlerProcess,  Spider, Scheduler , Settings} = require('../..')

let MockSpider1 = require('../spiders/mockspider1')

let process = new CrawlerProcess()
process.crawl(MockSpider1)
let result = process.start()
