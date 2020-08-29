const mergeFiles = require("merge-files");
var __dirname = "_nes/";
const outputPath = "common/nes.1.0.1.js";

const inputPathList = [
	__dirname + "nes.array.js",
	__dirname + "nes.date.js",
	__dirname + "nes.dom.js",
	__dirname + "nes.math.js",
	__dirname + "nes.string.js",
	__dirname + "nes.torrent.js",
	__dirname + "nes.url.js",
	__dirname + "nes.$dom/nes.$dom.js",
	__dirname + "nes.$dom/nes.$form.js",
	__dirname + "nes.$dom/nes.$img.js",
	__dirname + "nes.$dom/nes.$input.js",
];

// status: true or false
mergeFiles(inputPathList, outputPath)
	.then((success) => {
		console.log("success", success);
	})
	.catch((err) => {
		console.log("err", err);
	});

// console.log("done...", status)
