const mergeFiles = require ('merge-files');
 var __dirname="rarbg/";
const outputPath = __dirname+'result.js';

const inputPathList = [
    __dirname + 'a.js',
    __dirname + 'b.js',
    // __dirname + '/c'
];
 
// status: true or false
mergeFiles(inputPathList, outputPath)
.then(success=>{
	console.log("success",success)
})
.catch(err=>{
	console.log("err",err)
})

// console.log("done...", status)