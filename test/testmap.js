/**
 * Created by lzq on 2018/1/31.
 */

function test (map){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            map++;
            // if(map > 5){
            //    reject(map);
            // }
            resolve(map);

        }, 1000)
    })
}

let maps = [1,2,3,4,5];

let result = maps.map( function(map){
    return test(map);
});

async function tesPromise(){
    await Promise.all(result).then(function(kk){
        console.log(kk);
    }).catch(function(reason){
        console.log(reason)
    })
}

tesPromise()

