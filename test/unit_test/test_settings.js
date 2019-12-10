var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

const {Crawler, Spider, Scheduler , Settings} = require('../..')


/**
 * Unit test
 */
describe('Settings', function(){

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

    describe('#test_static_set', function(){

        let clsSetting = Settings.newCls().setProperty("testKey", "value01")
        let settingsInst = clsSetting.build()

        let actual = settingsInst.getProperty("testKey")

        it("settings ok when test finished", function(done){

            expect( actual ).to.equal('value01')

            done()

        })

    })

    describe('#test_downloadCls_convertto_download', function(){

        let clsSetting = Settings.newCls()
            .setProperty("DOWNLOAD_HANDLER_CLS.data", 'download.handlers.hdi.embbed')
        let settingsInst = clsSetting.build()


        let actualClsData = settingsInst.getProperty(
            "DOWNLOAD_HANDLER_CLS.data"
        )

        let actual = settingsInst.getProperty(
            "DOWNLOAD_HANDLERS.data"
        )

        it('return ok when test finished', function(done){

            expect(actual).to.not.be.null
            done()
        })
    })

    describe('#test_scheduler ', function(){

        let clsSetting = Settings.newCls().setScheduler()
        let settingsInst = clsSetting.build()
        let scheduler = settingsInst.getScheduler()

        it('return ok when test finished', function(done){

            expect(scheduler).to.not.be.null
            done()
        })

    })


})
