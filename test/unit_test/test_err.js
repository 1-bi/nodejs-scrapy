var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

const {Crawler, Spider , Settings} = require('../..')
const CodeErr = require('../../codeerr')

/**
 * Unit test
 */
describe('CodeError', function(){

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
    describe('#test_case1', function(){

        //let actual = slot.getStartRequests()

        it("[case1]: check error  --- OK", function(done){

            try {
                throw new CodeErr("testcase 1" , "testcode001")
            } catch (e) {
                console.log( e )
            }



            done()

        })

    })

})
