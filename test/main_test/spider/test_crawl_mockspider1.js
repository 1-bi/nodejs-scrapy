const {Crawler,CrawlerProcess,  Spider, Scheduler , Settings} = require('../../../index')

let MockCrawlSpider1 = require('../../spiders/mock_crawl_spider1')

let process = new CrawlerProcess()
process.crawl( MockCrawlSpider1 )
let result = process.start()
