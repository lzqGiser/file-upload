/**
 * Created by lzq on 2018/2/5.
 */

const file_req = require('../lib/index.js');

process.on('message', function(message, handler){  // 每一个子进程接受不同的指令去完成；
    const path = message.path;
    const workerOptions = message.workerOptions;
    test(path, workerOptions)  // 子进程开启该模块
});

function test (path, workerOptions){  // 一次只发给一个值
    let proMes = {}, _options = {};
    return new Promise(function(resolve,reject){
        proMes.path = path;
        proMes.pid = process.pid;
        proMes.status = false;

        _options.url = workerOptions.uploadURL;  // 'http://pic-in.meituan.com/storage/adunion';
        _options.isStream = workerOptions.isStream;
        _options.headers = workerOptions.headers || null;
        const options = file_req.reqOptions(_options);

        if(options.isStream){
            // 测试流式请求
            file_req.readStream(path, options).then(function(result){

                if(result === 200){
                    proMes.status = true;  // 标记成功
                    process.send(proMes)  // ture 表示该进程运行成功
                    resolve(proMes);
                }else{
                    process.send(proMes)  // ture 表示该进程运行成功
                    reject(proMes);
                }
            });
        }else{  // 非流式请求
            file_req.readFile(path, options).then(function(){
                if(result === 200){
                    proMes.status = false;  // 标记成功
                    process.send(proMes)  // ture 表示该进程运行成功
                    resolve(proMes);
                }else{
                    process.send(proMes)  // ture 表示该进程运行成功
                    reject(proMes);
                }
            })
        }
    }).catch(function(err){
        console.log(err)
    })
}

// function test (map){  // 一次只发给一个值
//     let proMes = {
//         status: false,
//         value: map.value,
//         count: 0  // 重试次数
//     };
//
//     return new Promise(function(resolve,reject){
//         setTimeout(function(){
//             if(proMes.value > 3){
//                 proMes.status = true;
//                 process.send(proMes)  // ture 表示该进程运行成功
//                 resolve();
//             }else{
//                 proMes.callback();
//                 process.send(proMes)  // ture 表示该进程运行失败
//                 reject();
//             }
//         }, 3000)
//     }).catch(function(map){
//         //console.log(map.value + '失败')
//     })
// }