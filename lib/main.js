/**
 * Created by lzq on 2018/1/31.
 */

/**
 * Created by lzq on 2018/1/31.
 */

const cluster = require('cluster');
const cupNum = require('os').cpus().length;
const child_process = require('child_process');
const file_req = require('./index.js');


let wokers = [];  // 存放工作进程对象
let failMaps = [];

// 每次订阅一个value，然后存储到map

module.exports = function (paths){     // 如果maps为空，则应该退出所有的进程
    let handlerFlag = 0;
    let pathLength = paths.length;

    if(cluster.isMaster){
        console.log(process.argv[1])  // 直接获取了该程序运行路径
        console.log(`主进程：${process.pid} 正在运行`)

        for(let i = 0; i < 3; i++){  // fork 对应cpu数量的进程出来  cupNum
            let currentWorker = cluster.fork();
            wokers.push(currentWorker)
        }

        for(let i = 0; i < 3; i++){  // fork 对应cpu数量的进程出来, 每次利用4个进程处理4个map
            wokers[i].send(paths[i])
            handlerFlag = i;  // 表示第几个maps中的内容被处理了
        }

        cluster.on('message', function(worker, message, handle){

            if(message.status){  // ture 成功  成功了，则接着处理接下来的map
                console.log(`处理map值为 ${message.path.value} 的进程处理成功`);
                handlerFlag++
                if(handlerFlag < pathLength){

                    worker.send(paths[handlerFlag])  // 处理下一个maps中的内容；

                    console.log(`使用进程${worker.id}开始处理maps中的第${handlerFlag}个`)

                }

            }else{  // 失败了则继续使用当前进程处理，如果失败了
                let newWorker;
                if(worker.isDead()){  // 如果worker这个线程死掉了，则重新fork一个进程出来
                    worker.kill();
                    newWorker = cluster.fork();
                    message.path.value--;
                    newWorker.send(message.path)
                }
                console.log(`新的进程：${worker.id} 启动`)
                message.path.value = 'http://www.baidu.com';
                worker.send(message.path)
            }
        });

        cluster.on('exit', function(worker, code, signal){
            console.log(`子进程：${worker.id} 退出`)
        });

    }else if(cluster.isWorker){  // 子进程（woker进程）应该完成的任务在这里 注意这段儿代码会在所有子进程中都运行

        process.on('message', function(message, handler){  // 每一个子进程接受不同的指令去完成；
            test(message.value)  // 子进程开启该模块
        })
    }

}


function test (path){  // 一次只发给一个值
    let proMes = {}, _options = {};
    return new Promise(function(resolve,reject){
        proMes.path = path;
        proMes.pid = process.pid;
        proMes.status = false;

        _options.url = 'http://localhost:8080/jpgtogif';
        const options = file_req.reqOptions(_options);


        // console.log('----path------')
        // console.log(path)
        // console.log(options)

        // 测试流式请求
        file_req.readStream(path, options).then(function(result){
            console.log('-=-=-=-=-')
            if(result === 200){
                proMes.status = true;
                process.send(proMes)  // ture 表示该进程运行成功
                resolve('success');
            }else{
                process.send(proMes)  // ture 表示该进程运行成功
                reject('failure');
            }

        });

        // setTimeout(function(){
        //     //map.value++;
        //     if(map.value > 2){
        //
        //         map.count ++; // 记数字；
        //         proMes.path = path;
        //         proMes.pid = process.pid;
        //         proMes.status = false;
        //         process.send(proMes);
        //         reject(path);
        //     }else{
        //         proMes.path = path;
        //         proMes.pid = process.pid;
        //         proMes.status = true;
        //         process.send(proMes)  // ture 表示该进程运行成功
        //         resolve(path);
        //     }
        //
        // }, 3000)


    }).catch(function(err){
        console.log('-----')
        console.log(err)
    })
}






