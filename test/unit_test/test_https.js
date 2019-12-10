var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

var https = require('https')
const axios = require('axios')

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


        const getBreeds = () => {
            try {
                return axios.get('https://www.baidu.com')
            } catch (error) {
                console.error(error)
            }
        }


        it('should return ok when test finished', function(done){

            const countBreeds = async () => {
                const breeds = getBreeds()
                    .then(response => {
                        if (response.data.message) {
                            done()
                            console.log(
                                `Got ${Object.entries(response.data.message).length} breeds`
                            )
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }

            countBreeds()

        })








    })

    describe('#createExecutiveTask()', function(){



        it('should return ok when test finished', function(done){



            //expect(foo).to.equal('bar');
            done()
        })
    })
})
