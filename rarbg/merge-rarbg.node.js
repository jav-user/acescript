const mergeFiles = require("merge-files");
var __dirname = "rarbg/torrents-4/";
const outputPath = __dirname + "torrents-4.result.js";

const inputPathList = [
	// "_nes/nes.1.0.1.js",
	__dirname + "torrents-4.scripts.js",
	__dirname + "torrents-4.data.js",
	__dirname + "torrents-4.dom.js",
	__dirname + "torrents-4.search.js",
	__dirname + "torrents-4.history.js",
	// __dirname + "torrent3/torrent3.declarations.js",
	// __dirname + "torrent3/torrent3.tpl.js",
	// __dirname + "torrent3/torrent3.raw-info.js",
	// __dirname + "torrent3/torrent3.dom.images.js",
	// __dirname + "torrent3/torrent3.dom.info.js",
	// __dirname + "torrent3/torrent3.foot.js",
	// __dirname + '/c'
];

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
