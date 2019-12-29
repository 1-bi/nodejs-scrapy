var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()
const utils = require('../../utils')

/**
 * Unit test
 */
describe('Defer', function(){

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

        function mainFun() {
            return "Main , Hello World "
        }


        function callback1( resolve ) {

            console.log( "receive : " + resolve  )
        }


        let defer = new utils.Deferred()
        defer.addCallbacks( callback1  )


        //let actual = slot.getStartRequests()

        it("[case1]: test result callback --- OK", function(done){

            try {
                defer.callback( mainFun )

            } catch (e) {
                console.log( e )
            }

            done()

        })

    })

    describe('#test_case2', function(){

        function mainFun() {

            throw new Error('Main error.')
            //return "Main , Hello World Error "
        }


        function errback1( error  ) {
            console.log( "receive : " + error  )
        }


        let defer = new utils.Deferred()
        defer.addErrback( errback1 )


        //let actual = slot.getStartRequests()

        it("[case1]: test errback --- OK", function(done){

            try {
                defer.callback( mainFun )
            } catch (e) {
                console.log( e )
            }

            done()

        })

    })


})
