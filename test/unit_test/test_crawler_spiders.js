var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

const {CrawlerProcess, CrawlerRunner , Scheduler , Settings} = require('../..')


/**
 * Unit test
 */
describe('CrawlerProcess-MockSpider', function(){

    before(function() {


    })
    after(function(){
        // runs after all tests in this block
    })
    beforeEach(function(){
        // runs before each test in this block
    })
    afterEach(function(){
        // runs after each test in this block
    })

    /**
     * start spider mocker
     */
    describe('#start mock-1', function(){
        let MockSpider1 = require('../spiders/mockspider1')

        let process = new CrawlerProcess()
        process.crawl(MockSpider1)

        it('should return ok when test finished', function(done){
            // # the script will block here until all crawling jobs are finished
            //let result = process.start()

            done()
        })

    })

    describe('#createExecutiveTask()', function(){



        it('should return ok when test finished', function(done){



            //expect(foo).to.equal('bar');
            done()
        })
    })
})
