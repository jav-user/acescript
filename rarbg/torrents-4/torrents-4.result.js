// ==UserScript==
// @name RarbgTorrents
// @namespace RarbgTorrents Script
// @match *://rarbgweb.org/torrents.php*
// @grant none
// @require https://jav-user.github.io/acescript/common/nes.1.0.1.js?a=1
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
//// @require https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.js
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrent.js?a=1
// ==/UserScript==

new ndom()
	.addStyle(
		"https://jav-user.github.io/acescript/rarbg/torrents-4/torrents-4.css",
		"torrents-4-css"
	)
	.addStyle(
		"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
		"font-awesome"
	);

const Files = {},
	$Files = {},
	Uploaders = {};

Lockr.prefix = "RARBG_";

var swPoster = false;

/*PARAMS*/
const PARAMS = new nurl(window.location.href).getParams();

var SEARCH = PARAMS.get("search") || "";
var CATEGORY = new narray([])
	.push(PARAMS.getAll("category"))
	.push(PARAMS.getAll("category[]"))
	.unique()
	.exec()
	.join(",")
	.split(",")
	.join(";")
	.split(";")
	.sort()
	.join(";");
const $tableTr = $("tr.lista2");

/* Firestore */

const RarbgRef = db.collection("RARBG").doc("RARBG");
const SearchList = RarbgRef.collection("search_");
const HistoryRef = RarbgRef.collection("history_");
const UploadersRef = RarbgRef.collection("uploaders_");

$(document).ready(function() {
	getIp()
		.then((ip) => {
			console.log("loading history...");
			return loadHistory();
		})
		.then(() => {
			console.log("saving search...");
			return saveSearch();
		})

		.then((s) => {
			// console.log("s", s);
			console.log("saving history...");
			return saveHistory();
		})
		.then((sh) => {
			// console.log("sh", sh);
			// return getHistory();
		})
		.then((u) => {
			console.log("geting uploaders");
			return getUploaders();
		});
});

async function getIp() {
	if (!Lockr.get("ipdata")) {
		await $.get("https://api.ipdata.co/?api-key=test").then((ipdata) => {
			Lockr.set("ipdata", ipdata);
		});
	}
	return Lockr.get("ipdata");
}
$tableTr.each((i, tr) => {
	const $td = $(tr).children("td");
	const $f = {};
	$f.$row = $(tr);
	$f.$category = $td.eq(0);
	$f.$file = $td.eq(1);
	$f.$name = $f.$file.find("a");
	$f.$added = $td.eq(2);
	$f.$size = $td.eq(3);
	$f.$seeders = $td.eq(4);
	$f.$leechers = $td.eq(5);
	$f.$uploader = $td.eq(7);

	const url = $f.$name.prop("href");
	const name = $f.$name.text();
	const id = CryptoJS.MD5(url).toString();
	var added = getDate($f.$added);
	var thumbnail = getThumbnail($f.$file.find("a"));
	var poster = getPoster(thumbnail);
	var filename = new nstring(name).validFN().exec();
	var words = new narray(
		filename.split(/[\[\]\.\- ]/).map((word) => word.toUpperCase())
	)
		.trim()
		.unique()
		.clear()
		.exec();
	// .sort();
	// console.log("words", words);
	var uploader = $f.$uploader.text();
	var uploaderID = CryptoJS.MD5(uploader).toString();
	const File = {
		categoryID: getCategoryID($f.$category),
		categoryUrl: $f.$category.find("a").prop("href"),
		updated: Date.now(),
		updatedstr: new Date().toString(),
		name: name,
		keywords: words,
		filename: new nstring(name).validFN().exec(),
		size: $f.$size.text(),
		bytes: new nstring($f.$size.text()).fileSize(),
		seeders: parseInt($f.$seeders.text()),
		leechers: parseInt($f.$leechers.text()),
		url: url,
		uploaded: added,
		uploadedStr: new Date(added).toString(),
		uploader: uploader,
		uploaderID: uploaderID,
		thumbnail: thumbnail,
		poster: poster,
		source: window.location.href,
	};
	Files[id] = File;
	$Files[id] = $f;
	Uploaders[uploaderID] = {
		name: uploader,
		updated: Date.now(),
		source: window.location.href,
	};
	// console.log(id, File);
	// formatDOM();
});

// console.log(Files);

function getDate($added) {
	var mtBerlin = moment.tz($added.text(), "Europe/Berlin");
	var mt = mtBerlin.clone().tz(new ndate().timeZone());
	return mt.valueOf();
}

function getCategoryID($category) {
	var href = $category.find("a").prop("href");
	var params = new nurl(href).getParams();
	return params.get("category");
}

function getThumbnail($title) {
	if (!$title[0].onmouseover) return null;
	var f = $title[0].onmouseover.toString();

	var match = `${f}`.match(/<img src=.*>/);

	if (!match) return false;

	var img = match[0].replaceAll("\\", "");

	var $img = $(img);
	var thumbnail = $img.attr("src");
	return thumbnail;
}

function getPoster(thumbnail) {
	if (!thumbnail) return null;
	var path = new URL(thumbnail).pathname;

	var so_char = path.split("/")[2] ? path.split("/")[3].charAt(0) : "";

	var poster = thumbnail;
	poster = thumbnail
		.replace("/static/over/", `/posters2/${so_char}/`)
		.replace("/over_opt.", "/poster_opt.")
		.replace("_small.", "_banner_optimized.");

	return poster;
}
function formatDom() {
	for (var id in $Files) {
		const $File = $Files[id];
		const File = Files[id];
		$File.$row.attr("id", "file-" + id);
		$File.$category.html(
			$(`<center>
					<a 
						href="${File.poster}" 
						target="_blank" >
						<img 
							class="nthumbnail" 
							src="${File.thumbnail || new n$img().error()}" 
							onmouseover="this.src='${File.poster || new n$img().error()}'"/>
					</a>
					<br/>
					<a 
						target="_blank" 
						href="${File.categoryUrl}">${File.categoryID}
					</a>
				</center>`)
		);

		// $File.$added.html($())
		addedDom($File.$added);

		// var classes = getClass({
		// 	name: File.name.text(),
		// 	bytes: File.bytes,
		// 	categoryID: File.categoryID,
		// });
		var classes = getClass(File);
		$File.$name.addClass(classes);
		$File.$size.addClass(classes);
		File.classes = classes;

		fileDom($File, File);
	}
}

formatDom();

function addedDom($added) {
	var mtBerlin = moment.tz($added.text(), "Europe/Berlin");
	var mt = mtBerlin.clone().tz(new ndate().timeZone());
	var str = mt.format("YYYY-MM-DD hh:mm:ss a");
	var ago = mt.fromNow();
	var now = moment();
	var minutes = now.diff(mt, "minutes");
	var hours = now.diff(mt, "hours");
	var days = now.diff(mt, "days");
	var months = now.diff(mt, "months");
	var years = now.diff(mt, "years");
	var classes = {
		"nless-10-minutes": minutes <= 10,
		"nless-1-hour": hours < 1,
		"nless-1-day": days < 1,
		"nless-1-month": months < 1,
		"nless-1-year": years < 1,
		"nmore-5-years": years > 5,
	};

	for (var k in classes) {
		if (classes[k]) {
			$added.addClass(k);
			break;
		}
	}

	$added.attr("title", str);
	$added.text(ago);
}

function getClass(data) {
	var classes = [];
	var season = data.name.match(/.S[0-9]{2}\./);
	var episode = data.name.match(/.S[0-9]{2}E[0-9]{2}\./);
	var ion10 = data.name.match(/ION10/);
	var imageset = data.name.toLowerCase().match(/imageset/);
	var GB1 = new nstring("1GB").fileSize();
	var GB2 = new nstring("3GB").fileSize();
	var GB3 = new nstring("3GB").fileSize();
	var GB3_5 = new nstring("3.5GB").fileSize();
	var GB4 = new nstring("4GB").fileSize();
	var GB5 = new nstring("5GB").fileSize();
	var GB10 = new nstring("10GB").fileSize();
	var adult = data.categoryID == 4;
	var movie =
		["14", "17", "44", "45", "48", "51", "54"].indexOf(data.categoryID) >
		-1;
	// console.log("nmovie", movie);
	var nclasses = new narray(classes).pushData({
		nfile: true,
		nimageset: imageset,
		nadult: adult && !imageset,
		"nadult-not": !adult,
		nseason: season && !adult,
		nepisode: episode && !adult,
		nion10: ion10 && !adult,
		nmovie: movie,
		"nless-1gb": data.bytes < GB1,
		"nless-2gb": data.bytes < GB2,
		"nless-3gb": data.bytes < GB3,
		"nless-3_5gb": data.bytes < GB3_5,
		"nless-4gb": data.bytes < GB4,
		"nless-5gb": data.bytes < GB5,
		"nless-10gb": data.bytes < GB10,
	});

	return classes;
}

function fileDom($File, File) {
	const $file = $File.$file;
	var $name = $file.find("a").eq(0);
	$name.text($name.text() + ` [${File.size}]`);

	hoverImage($File, File);
	var href = $name.prop("href");
	// console.log("search", SEARCH);
	var url = new nurl(href).setParam("search", SEARCH || "").toString();
	$name.prop("href", url);
}

function hoverImage($File, File) {
	var thumbnail = File.thumbnail;
	if (!thumbnail) return false;
	var poster = File.poster;
	var el = $File.$name[0];

	function hoverFn() {
		// $File.$category
		// .find("img")
		// .hide()
		// .attr("src", File.poster || new n$img().error())
		// .fadeIn(1000);
		if (!swPoster) posterAll();
		// console.log("overlib....")
		return overlib(
			`<img 
				style="max-height:500px" 
				src="${poster}" 
				border=0 
				onerror="this.src='${thumbnail}'"/>`
		);
	}

	el.onmouseover = hoverFn;

	$File.$category.find("img")[0].onmouseover = hoverFn;
}
function posterAll() {
	for (var id in $Files) {
		$Files[id].$category
			.find("img:not(.poster)")
			.attr("src", Files[id].poster || new n$img().error())
			.addClass("poster");
	}
	console.log("posterall...");
	swPoster = true;
}
const pages = ($("#pager_links").children().length || 2) - 1;
const resultspp = $("tr.lista2").length;

var SID = CryptoJS.MD5(`${SEARCH} | ${CATEGORY}`).toString();
const SearchDoc = SearchList.doc(SID);
const AccessList = SearchDoc.collection("access");

async function saveSearch() {
	SEARCH = SEARCH.trim();
	if (!SEARCH) return new Promise((solve) => solve(false));
	return db
		.runTransaction(function(tr) {
			return tr.get(SearchDoc).then((doc) => {
				var now = Date.now();
				var Access = {
					ip: Lockr.get("ipdata").ip,
					ipdata: Lockr.get("ipdata"),
					date: now,
					datestr: new Date().toLocaleString(),
					results: pages * resultspp,
					url: window.location.href,
				};

				var Search = {
					query: SEARCH,
					category: CATEGORY,
				};

				if (doc.exists) {
					var data = doc.data();
					var hours = moment().diff(moment(data.last), "hours");

					if (hours < 12) {
						tr.delete(AccessList.doc(data.last + ""));
					}
					// tr.delete(SearchDoc)

					tr.update(SearchDoc, Access);
				} else {
					tr.set(SearchDoc, Object.assign(Search, Access));
				}
				// var obj = Object.assign(Search, Access);
				// console.log("obj", obj);
				// tr.set(SearchDoc, obj);

				tr.set(AccessList.doc(now + ""), Access);
			});
		})
		.then(() => {
			return AccessList.get().then((sn) => {
				var count = sn.size;
				return SearchDoc.update({
					times: count,
				});
			});
		})
		.then(() => {
			return SearchList.orderBy("updated", "desc")
				.limit(5)
				.get()
				.then((sn) => {
					return sn.forEach((doc) => {
						console.log(doc.data());
					});
				});
		});
}
async function saveHistory() {
	// console.log("from history", Files);
	const batch = db.batch();
	for (var key in Files) {
		var File = Files[key];
		// console.log(key, File);
		const UploaderDoc = UploadersRef.doc(File.uploaderID);
		batch.set(UploaderDoc, Uploaders[File.uploaderID], { merge: true });
		batch.set(UploaderDoc.collection("uploads").doc(key), {
			url: File.url,
		});
		batch.set(HistoryRef.doc(key), File, { merge: true });
	}
	return batch.commit();
}
// async function updateUploadsCount() {
// 	// const batch = db.batch()
// 	for (var id in Uploaders) {
// 		const UploaderDoc = UploadersRef.doc(id);
// 		const UploadsList = UploaderDoc.collection("uploads");
// 		UploadsList.
// 		// batch.set(UploaderDoc)
// 	}
// }
async function getHistory() {
	return HistoryRef.orderBy("updated", "desc")
		.limit(5)
		.get()
		.then((q) => {
			return q.forEach((doc) => {
				// console.log("history", doc.data());
			});
		});
}

async function getUploaders() {
	return UploadersRef.orderBy("updated", "desc")
		.get()
		.then((q) => {
			return q.forEach((doc) => {
				console.log("uploader", doc.data().name);
			});
		});
}


async function loadHistory() {
	const ids = Object.keys(Files);
	// console.log(ids)
	const refs = ids.map((id) => HistoryRef.doc(id).get());
	return Promise.all(refs).then((q) => {
		return q.forEach((doc) => {
			const $name = $Files[doc.id].$name;
			if (doc.exists) {
				$name.after(` <span class="msg msg-seen" title="seen"><i class="fa fa-eye"></i></span>`);
			} else {
				$name.after(` <span class="msg msg-not-seen" title="not seen"><i class="fa fa-eye-slash"></i></span>`);
			}
		});
	});
}
