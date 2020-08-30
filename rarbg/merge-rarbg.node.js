const mergeFiles = require("merge-files");
var __dirname = "rarbg/torrent-vue/";
const outputPath = __dirname + "torrent-vue.result.js";

const torrents = [
	// "_nes/nes.1.0.1.js",
	__dirname + "torrents-4.scripts.js",
	__dirname + "torrents-4.data.js",
	__dirname + "torrents-4.dom.js",
	__dirname + "torrents-4.search.js",
	__dirname + "torrents-4.history.js",
];

const torrent=[
	__dirname + "torrent-vue.scripts.js",
	__dirname + "torrent-vue.data.js",
	__dirname + "torrent-vue.form.component.js",
	__dirname + "torrent-vue.last.js",

]

const inputPathList= torrent;

console.log(inputPathList);
// status: true or false
mergeFiles(inputPathList, outputPath)
	.then((success) => {
		console.log("success", success);
	})
	.catch((err) => {
		console.log("err", err);
	});

// console.log("done...", status)
