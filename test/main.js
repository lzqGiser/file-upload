/**
 * Created by lzq on 2018/2/2.
 */

const postHandler = require('./testmap');

let maps = [   // 一次将一个队列塞进来
    {
        value: 1,  //实际的值
        count: 0  // 已经运行的次数， 如果大于三次则不会发送了
    },
    {
        value: 2,  //实际的值
        count: 0
    },
    {
        value: 3,  //实际的值
        count: 0
    },
    {
        value: 4,  //实际的值
        count: 0
    },
    {
        value: 5,  //实际的值
        count: 0
    }];

postHandler(maps)