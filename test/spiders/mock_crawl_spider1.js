const spiders = require('../../spiders')
const CrawlRule = require('../../spiders/crawl_rule')
const extractors = require('../../linkextractors')

class MockCrawlSpider1 extends spiders.CrawlSpider {


    prepareCrawl() {
        let self = this

        // --- add rule ---
        let rule1 = new spiders.CrawlRule( new extractors.LinkExtractor( {
            'allow': ['*'],
            'restrict_xpaths': ['//div[@class=\'navi\']//a'],
            'restrict_css': [],
            'callback': self.parse_item1
        }))
        self.addRule( rule1 )
    }

    /**
     * implement spdier space
     * @override
     * @returns {[string]}
     */
    startRequests() {
        let startReqs = [
            'https://www.json.cn'
        ]
        return startReqs
    }

    /**
     * call parse response to object
     * @param response
     */
    parse_item1( response ) {
        console.log('parse item ')
        console.log(12346)
    }





}


module.exports = MockCrawlSpider1