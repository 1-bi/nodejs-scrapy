var assert = require('chai').assert
var expect = require('chai').expect
const farmhash = require('farmhash')
require('chai').should()

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

         hash = farmhash.hash32( Buffer.from('http://www.126.com/139?hteo=335499'))
        console.log( hash)



    })

    describe('#createExecutiveTask()', function(){


        it('should return ok when test finished', function(done){

            //expect(foo).to.equal('bar');
            done()
        })
    })
})
