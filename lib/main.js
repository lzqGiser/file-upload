/**
 * Created by lzq on 2018/1/31.
 * 问题： 采用了cluster后，就会造成主程序也被在多个进程中启动，因此就会导致每一个进程中都会加入所有的代码，会发现被执行多次
 *       因此，对于单个工具模块，不适合使用cluster，这会造成
 */


const cluster = require('cluster');
const cupNum = require('os').cpus().length;
const child_process = require('child_process');
const file_req = require('./index.js');


let wokers = [];  // 存放工作进程对象
let failMaps = [];



module.exports = function (paths) {     // 如果maps为空，则应该退出所有的进程
    return new Promise(function (resolve, reject) {

        let handlerFlag = 0;
        let pathLength = paths.length;

        setTimeout(function () {

            resolve('ok啦 78906');

        }, 2000)

        if (cluster.isMaster) {
            console.log(process.argv[1])  // 直接获取了该程序运行路径
            console.log(`主进程：${process.pid} 正在运行`)

            for (let i = 0; i < 3; i++) {  // fork 对应cpu数量的进程出来  cupNum
                console.log('0909')
                let currentWorker = cluster.fork();
                wokers.push(currentWorker)
            }

            for (let i = 0; i < 3; i++) {  // fork 对应cpu数量的进程出来, 每次利用4个进程处理4个map
                wokers[i].send(paths[i])
                handlerFlag = i;  // 表示第几个maps中的内容被处理了
            }

            cluster.on('message', function (worker, message, handle) {

                if (message.status) {  // ture 成功  成功了，则接着处理接下来的map
                    console.log(`处理map值为 ${message.path} 的进程处理成功`);
                    handlerFlag++;
                    if (handlerFlag < pathLength) {
                        worker.send(paths[handlerFlag])  // 处理下一个maps中的内容；
                        console.log(`使用进程${worker.id}开始处理maps中的第${handlerFlag}个`)
                    } else {
                        worker.process.kill('SIGHUP');  // 处理完毕所有的内容，则依次退出各个子进程
                    }
                } else {  // 失败了则继续使用当前进程处理，如果失败了
                    let newWorker;
                    if (worker.isDead()) {  // 如果worker这个线程死掉了，则重新fork一个进程出来
                        worker.kill();
                        newWorker = cluster.fork();
                        wokers.push(newWorker)
                        message.path.value = '/Users/dianping/Documents/exercise/file-upload/img/img01.jpg';
                        newWorker.send(message.path)
                    }
                    console.log(`新的进程：${worker.id} 启动`)
                    message.path.value = '/Users/dianping/Documents/exercise/file-upload/img/img01.jpg';
                    worker.send(message.path)
                }
            });

            cluster.on('exit', function (worker, code, signal) {
                console.log(`子进程：${worker.id} 退出`)
            });

        } else if (cluster.isWorker) {  // 子进程（woker进程）应该完成的任务在这里 注意这段儿代码会在所有子进程中都运行

            process.on('message', function (message, handler) {  // 每一个子进程接受不同的指令去完成；
                test(message.value)  // 子进程开启该模块
            })
        }
    })
}





function test (path){  // 一次只发给一个值
    let proMes = {}, _options = {};
    return new Promise(function(resolve,reject){
        proMes.path = path;
        proMes.pid = process.pid;
        proMes.status = false;

        _options.url = 'http://pic-in.meituan.com/storage/adunion';
        const options = file_req.reqOptions(_options);

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

    }).catch(function(err){
        console.log('-----')
        console.log(err)
    })
}






