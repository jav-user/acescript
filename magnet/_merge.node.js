const mergeFiles =require( 'merge-files');

// const __dirname = ""

const outputPath = __dirname + '/_result-magnets.js';
 
const inputPathList = [
	__dirname + '/require.js',
    __dirname + '/scripts.js',
    __dirname + '/magnets.js',
    // __dirname + '/3.txt'
];
 
// status: true or false
//const status = await mergeFiles(inputPathList, outputPath);
// or
console.log(inputPathList)
mergeFiles(inputPathList, outputPath).then((status) => {
    // next
    console.log("status",status)
}).catch(err=>console.log("err",err))