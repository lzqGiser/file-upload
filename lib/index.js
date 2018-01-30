/**
 * Created by lzq on 2018/1/29.
 * (1)集成内存中处理文件的能力<可选>;
 * (2)支持单个和批量文件上上传功能；
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
 * @param path {String || Array} 需要上传的目标内容
 * @param options {Object}:   url {String}  上传的服务器地址
 *                            headers {Object} 额外的请求头部
 *                            boundary {String} 自定义boundary 可以省略
 *                            isStream {Bool} 处理方式，默认true 流模式、如果选择普通存储模式，可以设置为false
 * */

function upLoad (path, options) { // 上载做好的图片资源
    let _options = options || {};
    let _path = path;
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

    // array
    if(typeof _path === 'object'){

    }


    const imgReadStream = fs.createReadStream('./static/teresa-tengs-65th-birthday-4912312048680960-l.png')
    const formData = {}
    formData['my_file'] = imgReadStream
    options.formData = formData
    request.post(options, function (err, response, body) {
        console.log(body)
    })

    function generateBoundary () {
        let boundary = '---------'
        boundary += Math.random().toString().replace('.', '') + (new Date().valueOf())
        return boundary
    }
}






module.export = {
    fileUpload
}