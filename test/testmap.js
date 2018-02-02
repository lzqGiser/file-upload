/**
 * Created by lzq on 2018/1/31.
 */

const cluster = require('cluster');
const cupNum = require('os').cpus().length;

const child_process = require('child_process');

let wokers = [];  // 存放工作进程对象

// child_process.fork('./lib/woker.js');




let failMaps = [];

// 每次订阅一个value，然后存储到map


module.exports = function (maps){     // 如果maps为空，则应该退出所有的进程


    if(cluster.isMaster){
        console.log(process.argv[1])  // 直接获取了该程序运行路径
        console.log(`主进程：${process.pid} 正在运行`)

        for(let i = 0; i < cupNum; i++){  // fork 对应cpu数量的进程出来
            let currentWorker = cluster.fork();

            wokers.push(currentWorker)
        }

        for(let i = 0; i < 4; i++){  // fork 对应cpu数量的进程出来, 每次利用4个进程处理4个map
            wokers[i].send(maps[i])
        }

        cluster.on('message', function(worker, message, handle){
            //console.log(`收到 ${worker.id} 发来的 ${message} 消息`)

            if(message.status){  // ture 成功  成功了，则接着处理接下来的map
                console.log(`处理map值为 ${message.map.value} 的进程处理成功`)



            }else{  // 失败了则继续使用当前进程处理，如果失败了
                // console.log(worker.id)
                //worker.kill();  // 杀死当前子进程 不杀死
                let newWorker;

                if(worker.isDead()){  // 如果worker这个线程死掉了，则重新fork一个进程出来
                    worker.kill();
                    newWorker = cluster.fork();
                    message.map.value--;
                    newWorker.send(message.map)
                }
                console.log(`新的进程：${worker.id} 启动`)
                message.map.value--;
                worker.send(message.map)
            }

        });

        cluster.on('exit', function(worker, code, signal){
            console.log(`子进程：${worker.id} 退出`)
        });


    }else if(cluster.isWorker){  // 子进程（woker进程）应该完成的任务在这里 注意这段儿代码会在所有子进程中都运行

        process.on('message', function(message, handler){  // 每一个子进程接受不同的指令去完成；
            test(message)  // 子进程开启该模块
            console.log(message.value)
        })

        // if(cluster.worker.id > 7){
        //     setTimeout(function(){
        //         process.send('lzq')
        //     },1000)
        // }
    }




}





function test (map){  // 一次只发给一个值
    let proMes = {};
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            //map.value++;
            if(map.value > 2){
                failMaps.push(map.value)
                map.count ++; // 记数字；

                proMes.map = map;
                proMes.pid = process.pid;
                proMes.status = false;
                process.send(proMes);
                reject(map);
            }else{

                proMes.map = map;
                proMes.pid = process.pid;
                proMes.status = true;
                process.send(proMes)  // ture 表示该进程运行成功
                resolve(map);
            }

        }, 3000)
    }).catch(function(map){
        //console.log(map.value + '失败')
    })
}






