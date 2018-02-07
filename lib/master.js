/**
 * Created by lzq on 2018/1/31.
 * 特点： master和worker配置分离，独立构建，方便管理
 */

const child_process = require('child_process');

const SUB_WORKER = './lib/worker.js';

let wokers = [];  // 存放工作进程对象
let resResult = [];

module.exports = function (maps, options) {     // 如果maps为空，则应该退出所有的进程
    return new Promise(function(resolve, reject){

        let handlerFlag = 0;
        const mapLength = maps.length;
        let _processNum = 0;  // 进程数
        let _count = options.count || 3;
        if(options.processNum < mapLength){
            _processNum = options.processNum;
        }else if(mapLength > 3){
            _processNum = 3;
        }else{
            _processNum = mapLength;
        }

        const _opt = handlerOpts (options);
        const _maps = format (maps, _opt.workerOptions);

        console.log(`主进程：${process.pid} 正在运行`);
        for (let i = 0; i < _processNum; i++) {  // fork 对应cpu数量的进程出来
            const currentWorker = child_process.fork(SUB_WORKER);
            currentWorker.count = 0;
            wokers.push(currentWorker)
        }

        for (let i = 0; i < 3; i++) {  // fork 对应cpu数量的进程出来, 每次利用4个进程处理4个map
            handlerFlag++;
            console.log(`开始启动：${wokers[i].pid} 进程`);

            wokers[i].send(_maps[i])

            wokers[i].on('message', function (message) {
                console.log(`handlerFlag: ${handlerFlag}`)
                if(message.status){  // 成功继续处理
                    console.log(`执行：${wokers[i].pid}进程成功`)
                    resResult.push(message.resPath)
                    handlerFlag++;
                    wokers[i].count = 0;

                    if(handlerFlag - 1 < mapLength){
                        console.log(`${wokers[i].pid} 进程，执行下一个值`)
                        wokers[i].send(_maps[handlerFlag - 1])
                    }else{
                        wokers[i].kill('SIGHUP');
                    }
                }else{
                    if(wokers[i].connected ){  // 该子进程没有死 同一个进程失败调用次数不超过三次
                        console.log(`${wokers[i].pid} 进程执行失败，重新执行！！`)
                        wokers[i].count++;

                        if(wokers[i].count < _count){
                            wokers[i].send(_maps[handlerFlag - 1])
                        }else{
                            console.log(`同一个内容处理次数超过三次`);
                            handlerFlag++; // 处理下一个
                            if(handlerFlag - 1 < mapLength){  // 防止执行超过规定次数
                                wokers[i].send(_maps[handlerFlag - 1])
                            }else{
                                console.log(`数据处理完毕！！`)
                            }
                        }

                    }else{
                        const newWorker = child_process.fork(SUB_WORKER);
                        console.log(`${wokers[i].pid} 进程挂掉了！！`)

                        _maps[handlerFlag - 1] = '/Users/dianping/Documents/exercise/file-upload/img/img01.jpg';
                        newWorker.send(_maps[handlerFlag - 1])
                    }
                }
            });
            wokers[i].on('exit', function(){
                console.log(`${wokers[i].pid}进程退出`)
            })
        }

        process.on('exit',function(){
            resolve(resResult);
            console.log(`任务完成！！`)
        });

    })
}

/*
* @param options {Object} : <url: 要发送的>
*
* */

function handlerOpts (options){
    let _options = {};
    _options.processNum = options.processNum || 3; // 默认开三条进程；如果同时处理的内容少于3条 应该开数据内容条数的进程；
    _options.count = options.count || 3; // 单次失败后，自动尝试次数，默认三次
    _options.workerOptions = options.workerOptions || {};

    return _options;
}

/*
* @param arr {Array} path数组
* @param workOpts {Object} worker配置
* */

function format (arr, workOpts){
    const obj = {};
    return _maps = arr.map(function(item){
        obj.path = item;
        //obj.targetUrl = targetUrl;
        obj.workerOptions = workOpts;
        return obj;
    });
}