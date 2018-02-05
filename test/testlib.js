/**
 * Created by lzq on 2018/2/5.
 */

const reqMain = require('../lib/main.js');
const path = require('path');

function resolve (relativePath){
    return path.join(__dirname, relativePath)
}

const reqPaths = [   // 一次将一个队列塞进来
    {
        value: resolve('../img/img01.jpg'),  //实际的值
        count: 0  // 已经运行的次数，                   这个以后也可以做成配置限制，让用户指定可以尝试次数
    },
    {
        value: resolve('../img/img01.jpg'),  //实际的值
        count: 0
    },
    {
        value: resolve('../img/img01.jpg'),  //错误的路径
        count: 0
    },
    {
        value: resolve('../img/img01.jpg'),  //实际的值
        count: 0
    },
    {
        value: resolve('../img/img01.jpg'),  //错误的值
        count: 0
    }];


// console.log(reqPaths)

reqMain(reqPaths);