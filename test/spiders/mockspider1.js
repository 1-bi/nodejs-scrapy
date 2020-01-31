
const Spider = require('../../spiders/spider')

class MockSpider1 extends Spider {


    /**
     * implement spdier space
     * @override
     * @returns {[string]}
     */
    startRequests() {
        let startReqs = [
            'https://www.baidu.com'
        ]
        return startReqs
    }

}


module.exports = MockSpider1