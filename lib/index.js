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


}

// fileUpload();

/*
 * upLoad
 * @param path {String || Array} 需要上传的目标内容路径
 * @param options {Object}:   url {String}  上传的服务器地址
 *                            headers {Object} 额外的请求头部
 *                            boundary {String} 自定义boundary 可以省略
 *                            isStream {Bool} 处理方式，默认true 流模式、如果选择普通存储模式，可以设置为false
 * */

function upLoad (path, options) { // 上载做好的图片资源
    let _options = options || {};
    let _path = path;
    let _Queue = [];
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

    const options = {
        url: _url,
        method: 'POST',
        headers: _headers
    }

    // array  处理批量上传
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

    // 都通过 _Queue 来统一发送






    function generateBoundary () {
        let boundary = '---------'
        boundary += Math.random().toString().replace('.', '') + (new Date().valueOf())
        return boundary
    }
}

// 流式读取
function readStream (path, options) {
    return new Promise(function(resolve, reject){
        const _formData = {};
        _formData['my_file'] = fs.createReadStream(path);
        options.formData = _formData;

        request.post(options)
            .on('response',function(res){
                if(res.statusCode){
                    resolve();
                }else{
                    reject('post request is failure!!');
                }
            })
            .on('error', function(err){
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
                if(res.statusCode){
                    resolve();
                }else{
                    reject('post request is failure!!');
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