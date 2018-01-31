/**
 * Created by lzq on 2018/1/29.
 * (1)集成内存中处理文件的能力<可选>;
 * (2)支持单个和批量文件上上传功能；批量上传功能 是否要考虑引入队列机制, 控制请求发送速度, 失败后尝试二次发送，两次失败则放弃；
 */
'use strict'

const request = require('request');
const fs = require('fs');  // 硬盘
const gm = require('gm');
const MemoryFileSystem = require('memory-fs');

// let mFs = new MemoryFileSystem();
//
// let outputPath = '/img';
//
// mFs.mkdirpSync(outputPath);  // 创建虚拟目录
// mFs.writeFileSync(outputPath + '/123.txt', 'hello, world');
//
// const img = fs.readFileSync('./test/123.jpg');  // 从硬盘中读取文件
// mFs.writeFileSync(outputPath + '/321.jpg', img);
// console.log(mFs.readFileSync(outputPath + '/321.jpg'));


async function fileUpload(){

    let _p;
    if(typeof _path === 'object'){
        _path.forEach(function(p){
            typeof p === 'string' && fs.existsSync(p) ? _p = p : _p = null;
            if(typeof _p){
                _Queue.push(p);
            }
        })

    }else if(typeof _path === 'string' && fs.existsSync(_path)){ // string && path 存在
        _Queue.push(_path);
    }


    sendRes (Queue)

}

// fileUpload();

let _Queue = [];
let _failQueue = [];

/*
 * upLoad
 * @param path {String || Array} 需要上传的目标内容路径
 * @param Queue {Array} 要上载的url队列
 * @param options {Object}:   url {String}  上传的服务器地址
 *                            headers {Object} 额外的请求头部
 *                            boundary {String} 自定义boundary 可以省略
 *                            isStream {Bool} 处理方式，默认true 流模式、如果选择普通存储模式，可以设置为false
 * */

async function upLoad (path, options) { // 上载做好的图片资源
    let _options = options || {};
    let _path = path;
    let _isStream;

    let _headers = {
        'Content-Type': 'multipart/form-data'
    };
    if(_options.headers){
        Object.keys(_options.headers).forEach(function(header){
            _headers[header] = _options.headers[header];
        })
    }

    let _boundary = _options.boundary || generateBoundary();
    _headers['Content-Type'] = _headers['Content-Type'] + ';boundary=' + _boundary;

    const _url = _options.url;
    if(!_url){
        throw ('server target url is null')
    }
    typeof _options.isStream === 'boolean' ? _isStream = _options.isStream : _isStream = true;  // 默认为true


    const reqOptions = {
        url: _url,
        method: 'POST',
        headers: _headers
    }


    if(_isStream){
        await readStream (_path, reqOptions)

    }else{
        await readFile (_path, reqOptions)
    }


    function generateBoundary () {
        let boundary = '---------';
        boundary += Math.random().toString().replace('.', '') + (new Date().valueOf())
        return boundary
    }
}


// 发送请求
function sendRes (Queue) {
    let _Queue;
    let promises;
    Queue.length ? _Queue = Queue : _Queue = null;

    if(!_Queue){
        return;
    }

    // 都通过 _Queue 来统一发送, 如何检测_Queue????  考虑递归
    promises = _Queue.map(async function(que){
        return await upLoad(que);
    })


    /* 对失败的内容自动重新发送一次解决思路：几种️方法
        1. 通过定时器去检查 pass
        2 通过多进程，利用负载均衡，对失败的内容重新fork子进程去处理，利用主节点的调度
        3 利用递归 (这种也无法做到对异步内容的处理)
     */



}


// 流式读取
function readStream (path, options) {
    return new Promise(function(resolve, reject){
        const _formData = {};
        _formData['my_file'] = fs.createReadStream(path);
        options.formData = _formData;

        request.post(options)
            .on('response',function(res){
                if(res.statusCode === 200){
                    resolve();
                }else{
                    _failQueue.push(path); // 失败后记录
                    reject(path);
                }
            })
            .on('error', function(err){  // 这种情况，不需要重新发了
                reject(err);
            })
    })
}

// 普通处理
function readFile (path, options) {
    return new Promise(function(resolve, reject){
        const _formData = {};
        _formData['my_file'] = fs.readFileSync(path);
        options.formData = _formData;
        request.post(options)
            .on('response',function(res){
                if(res.statusCode === 200){
                    resolve(true);
                }else{
                    _failQueue.push(path); // 失败后记录
                    reject(path);
                }
            })
            .on('error', function(err){
                reject(err);
            })
    })
}


module.export = {
    fileUpload
}