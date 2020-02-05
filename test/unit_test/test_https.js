var assert = require('chai').assert
var expect = require('chai').expect
const farmhash = require('farmhash')
require('chai').should()
const superagentInst = require('superagent');
var https = require('https')

const {Crawler, Spider, Scheduler , Settings} = require('../..')


/**
 * Unit test
 */
describe('Https', function(){

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

    describe('#simple_test1', function(){

        let builder = superagentInst.get( 'http://www.126.com' )




        it('should return o5555k when test finished', function(done){
            builder.then( (res) => {
                console.log("error ------------- ")


                console.log( res )


            }).catch(err => {




































                // err.message, err.response
                console.log("error ------------- ")
                console.log( err )
            })
            //expect(foo).to.equal('bar');
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
