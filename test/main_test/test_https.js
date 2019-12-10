var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

var https = require('https')
const request = require('superagent');
const {Crawler, Spider, Scheduler , Settings} = require('../..')

let url = "https://www.baidu.com"

request.get(url)
    .set("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36")
    .end( (error,res) => {
    //do something

    console.log( res.text )
})
