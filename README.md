# file-upload

> a file uploading tool base on Multiple Processes

> node > 8.x

> you can use the tool for uploading file;

### Super simple to use
> in most cases, you need not care for options except the workerOptions, you should
assign the target server by the property of uploadURL;

    const paths = [
        resolve('../img/img01.jpg'),
        resolve('../img/img01.jpg'),
        resolve('../img/img01.jpg'),
        resolve('../img/img01.jpg'),
        resolve('../img/img01.jpg')
    ];

    let opt.workerOptions.uploadURL = 'http://targetServer' // target server url <Required>

    fileUpload(paths, opt).then(function(result){
        console.log(result)  // return the result on the basis of target server
    });

> file-upload also provide some choices;

### Table of contents
1. multiple Processes;
2. number of resending;
3. customized request

###### multiple Processes

>

###### number of resending

>

###### customized request

>