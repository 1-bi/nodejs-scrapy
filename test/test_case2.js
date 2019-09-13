var vm = require("vm");

var p = 5;
global.p = 11;

vm.runInThisContext("console.log('ok', p)");// 显示global下的11
vm.runInThisContext("console.log(global)"); // 显示global

console.log(p);// 显示5