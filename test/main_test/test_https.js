var assert = require('chai').assert
var expect = require('chai').expect
require('chai').should()

var https = require('https')
const request = require('superagent');

let url = "https://www.baidu.com"
/*
request.get(url)
    .set("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36")
    .end( (error,res) => {
    //do something
    console.log( res.text )
    })
*/
let builder = request.get(url)
    .set("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36")
console.log(builder)
builder.then( (res) => {
        //do something
        console.log(' ----------- ')
        console.log( res.text )
    }).catch( (err) => {
        //do something
        console.log('============')
        console.log( err  )

    })
