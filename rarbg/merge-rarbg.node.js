const mergeFiles = require("merge-files");
var __dirtorrent = "rarbg/torrent-vue-2/";
var __dirtorrents = "rarbg/torrents-4/";

const __outputtorrent = __dirtorrent + "torrent.result.js";
const __outputtorrents = __dirtorrents + "torrents.result.js";

const torrents = [
	__dirtorrents + "torrents-4.scripts.js",
	__dirtorrents + "torrents-4.data.js",
	__dirtorrents + "torrents-4.dom.js",
	__dirtorrents + "torrents-4.search.js",
	__dirtorrents + "torrents-4.history.js",
];

const torrent = [
	__dirtorrent + "torrent-vue-2.scripts.js",
	__dirtorrent + "torrent-vue-2.init.js",
	__dirtorrent + "torrent-vue-2.data.js",
	__dirtorrent + "torrent-vue-2.form.component.js",
	// __dirtorrents + "torrent-vue-2.images-async.component.js",
	__dirtorrent + "torrent-vue-2.image.component.js",
	__dirtorrent + "torrent-vue-2.images.component.js",
	__dirtorrent + "torrent-vue-2.last.js",
];

// const inputPathList = torrents;

console.log(torrent, torrents);
// status: true or false
mergeFiles(torrent, __outputtorrent)
	.then((success) => {
		console.log("success", success);
		return success;
	})
	.catch((err) => {
		console.log("err", err);
	});

mergeFiles(torrents, __outputtorrents)
	.then((success) => {
		console.log("success", success);
		return success;
	})
	.catch((err) => {
		console.log("err", err);
	});
