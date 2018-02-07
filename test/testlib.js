/**
 * Created by lzq on 2018/2/5.
 */

const reqMain = require('../lib/main.js');
const newTest2 = require('./master');

const path = require('path');
const child_process = require('child_process');


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



const reqPaths2 = reqPaths.map(function(item){
    return item.value;
})

console.log(reqPaths2)

const maps = [   // 一次将一个队列塞进来
    {
        value: 1  //错误的值
    },
    {
        value: 2  //错误的值
    },
    {
        value: 3  //错误的值
    },
    {
        value: 4 //错误的值
    },
    {
        value: 5  //错误的值
    }];


// async function test (){
//     let code = await reqMain(reqPaths)
//
//     console.log(code)
//     console.log(123)
// }

// test();

newTest2(reqPaths2);

let j = 0;
for(let i = 0; i < 10; i++){
    j+=i;
}

console.log(j);




