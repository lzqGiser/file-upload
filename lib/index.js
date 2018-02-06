/**
 * Created by lzq on 2018/1/29.
 * (1)集成内存中处理文件的能力<可选>;
 * (2)支持单个和批量文件上上传功能；批量上传功能 是否要考虑引入队列机制, 控制请求发送速度, 失败后尝试二次发送，两次失败则放弃；
 */
'use strict';

const request = require('request');
const fs = require('fs');  // 硬盘
const gm = require('gm');
const crypto = require('crypto')

let _failQueue = [];

/*
 * @param path {String || Array} 需要上传的目标内容路径
 * @param Queue {Array} 要上载的url队列
 * @param options {Object}:   url {String}  上传的服务器地址  <必须>
 *                            headers {Object} 额外的请求头部
 *                            boundary {String} 自定义boundary 可以省略
 *                            isStream {Bool} 处理方式，默认true 流模式、如果选择普通存储模式，可以设置为false
 * */

function reqOptions (options) { // 上载做好的图片资源
    let _options = options || {};
    // let _path = path;
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
        uri: _url,
        isStream: _isStream,
        method: 'POST',
        headers: _headers
    }

    // todo: reqOptions

    return reqOptions;

    function generateBoundary () {
        let boundary = '---------';
        boundary += Math.random().toString().replace('.', '') + (new Date().valueOf())
        return boundary
    }

    function createMTAuthHeaders (authInfo) {
        let stringToSign = authInfo.method + ' ' + authInfo.uri + '\n' + authInfo.date.toGMTString()
        let signature = crypto.createHmac('sha1', authInfo.clientSecret).update(stringToSign).digest('base64')
        let authorization = 'MWS ' + authInfo.clientId + ':' + signature
        return {
            'Date': authInfo.date.toGMTString(),
            'Authorization': authorization
        }
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
                if(res.statusCode === 200){
                    resolve(200);
                }else{
                    console.log(res.statusCode)
                    reject(404);  // 错误用404
                }
            })
            .on('error', function(err){  // 这种情况，不需要重新发了
                console.log('=====index.js readStream=====')
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
                    console.log(res.statusCode)
                   reject(404);
                }
            })
            .on('error', function(err){
                reject(err);
            })
    })
}

module.exports = {
    readStream,
    readFile,
    reqOptions
};

