
const Spider = require('../../spiders/spider')

class MockSpider1 extends Spider {


    /**
     *
     * @override
     * @returns {[]|*[]}
     */
    getStartRequests() {
        let startReqs = [
            'https://www.baidu.com'
        ]
        return startReqs
    }

}


module.exports = MockSpider1