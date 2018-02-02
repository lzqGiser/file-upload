/**
 * Created by lzq on 2018/2/2.
 */

const cluster = require('cluster');
const cupNum = require('os').cpus().length;

if(cluster.isMaster){

    for(let i = 0; i < cupNum; i++){
        cluster.fork();
    }
}else{
    setTimeout(function(){
        console.log(`工作进程：${process.pid}`)
    },1000)
}