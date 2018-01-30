/**
 * Created by lzq on 2018/1/29.
 */
'use strict'

const request = require('request');
const fs = require('fs');  // 硬盘
const gm = require('gm');
const MemoryFileSystem = require('memory-fs');

/*
* upLoad
* @param url {String}
* */

let inputPahtNet = ['https://img.meituan.net/msmerchant/1ca6b8d106f2670291893026f5d3db1b277547.jpg',
    'http://p0.meituan.net/dpmerchantalbum/773755ad19fc5fced3c08bc66d6b5b24227318.jpg',
    'http://p1.meituan.net/adunion/5ca866eed4eabc57cf669192013c212c250767.jpg'
];

let outputPath = '/img';

let mFs = new MemoryFileSystem();

mFs.mkdirpSync(outputPath);
mFs.writeFileSync(outputPath + '/123.txt', 'hello, world');

const img = fs.readFileSync('./test/123.jpg');
mFs.writeFileSync(outputPath + '/321.jpg', img);

console.log(mFs.readFileSync(outputPath + '/321.jpg'));

async function fileUpload(){
    let promises = inputPahtNet.map(function(path){
        return getImg(path);
    });
    let pathList = await Promise.all(promises)

    console.log('------------')
    console.log(pathList)

    //await jpg2Gif(inputPahtNet, );

}

// fileUpload();



module.export = {
    fileUpload
}