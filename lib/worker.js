/**
 * Created by lzq on 2018/2/5.
 */

const file_req = require('./upload.js');

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
        proMes.resPath = null;  //结果

        _options.url = workerOptions.uploadURL;  // 'http://pic-in.meituan.com/storage/adunion';
        _options.headers = workerOptions.headers || null;
        const options = file_req.reqOptions(_options);

        // 测试流式请求
        file_req.readStream(path, options).then(function(data){

            if(data !== 404){
                proMes.resPath = data.toString();
                proMes.status = true;  // 标记成功
                process.send(proMes)  // ture 表示该进程运行成功
                resolve(proMes);
            }else{
                process.send(proMes)
                reject(proMes);
            }
        });
    }).catch(function(err){
        console.log(err)
    })
}