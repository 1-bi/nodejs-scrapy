var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()
const utils_response = require('../../../utils/response')

/**
 * Unit test
 */
describe('utils.response', function(){

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
    describe('#getBaseUrl --- case 1', function(){

       let case1_url = "https://nvxie.tmall.com/?spm=875.7931836/B.category2016012.1.66144265jIu1Kr&acm=lb-zebra-148799-667863.1003.4.708026&scm=1003.4.lb-zebra-148799-667863.OTHER_14561689118972_708026"

        it("[result-1]: OK", function(done){
            let actual = utils_response.getBaseUrl( case1_url )
            console.log(actual )

            done()

        })

        // --- base path ---


    })


})
