/**
 * Created by lzq on 2018/2/6.
 * 入口
 */

const master = require('./index');
const path = require('path');
const crypto = require('crypto')


function resolve (relativePath){
    return path.join(__dirname, relativePath)
}

const reqPaths = [   // 一次将一个队列塞进来
    {
        value: resolve('../img/img01.jpg'),  //实际的值
    },
    {
        value: resolve('../img/img01.jpg'),  //实际的值
    },
    {
        value: resolve('../img/img01.jpg'),  //错误的路径
    },
    {
        value: resolve('../img/img01.jpg'),  //实际的值
    },
    {
        value: resolve('../img/img01.jpg'),  //错误的值
    }];

const reqPaths2 = reqPaths.map(function(item){
    return item.value;
});

/*
* @param reqPaths2 {Array}  // 发送的内容的路径
* @param options {options} <count processNum workerOptions<object>>
*     @param count
*     @param processNum
*     @param workerOptions <uploadURL headers....>
*          @param uploadURL {String}
*          @param headers {Object}
* */



opt.workerOptions.headers = headers;

master(reqPaths2, opt).then(function(result){
    console.log(result)
});


// function format (arr, targetUrl){
//     const obj = {};
//     return _maps = arr.map(function(item){
//         obj.path = item;
//         obj.targetUrl = targetUrl;
//         return obj;
//     });
// }

// console.log(format(reqPaths2,'http://www.baidu.com'))