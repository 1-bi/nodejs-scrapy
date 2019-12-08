var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

const {Crawler, Spider, Scheduler , Settings} = require('../index')


/**
 * Unit test
 */
describe('Crawler', function(){

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

    describe('#create and start crawler', function(){

        var array = []
        array.push("https://www.baidu.com/")

        var spiderSettings = Settings.build()



        // --- return ok
        it('start crawler ok', function(done){
            var spi  = new Spider()
            spi.setStartUrls( array )

            var c = new Crawler(spi , spiderSettings)

            // 启动爬虫动作
            c.start()


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