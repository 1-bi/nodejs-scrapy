var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

const Slot = require('../../core/engine').Slot
const Scheduler = require('../../scheduler/embbed')
const {Crawler, Spider , Settings} = require('../..')


/**
 * Unit test
 */
describe('Slot', function(){

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
     * check start request is not null
     */
    describe('#test_startrequest_case1', function(){
        var callMethod = function() {

            console.log( callMethod )

        }

        let inst = new Scheduler()
        let array = ['https://www.mockbin.com/request']

        var spi  = new Spider()
        spi.setStartUrls( array )

        let startRequest = spi.getStartRequests().shift()
        let slot = new Slot(startRequest, callMethod, inst)

        let actual = slot.getStartRequests()

        it("[case1]: start request not null --- OK", function(done){
            expect( actual ).to.be.an.instanceof(Array)

            if ( actual.length == 1 ) {
                let actualUrl = actual[0].getUrl()
                expect( actualUrl ).to.equal('https://www.mockbin.com/request')
            }
            else {

            }


            done()

        })

    })

})
