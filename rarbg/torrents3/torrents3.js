// ==UserScript==
// @name RarbgTorrents
// @namespace RarbgTorrents Script
// @match *://rarbgweb.org/torrents.php*
// @grant none
// @require https://jav-user.github.io/acescript/common/nes.1.0.1.js?a=2
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrent.js?a=1
// ==/UserScript==

new ndom().addStyle(
	"https://jav-user.github.io/acescript/rarbg/torrents3/torrents3.css",
	"torrents3-css"
);
const RarbgRef = db.collection("javuser").doc("Rarbg");
const SearchRef = RarbgRef.collection("SEARCH");

//const URL = new nurl(window.location.href).getUrl()
const PARAMS = new nurl(window.location.href).getParams();
var SEARCH = PARAMS.get("search") || "";
var CATEGORY = new narray([])
	.push(PARAMS.getAll("category"))
	.push(PARAMS.getAll("category[]"))
	.unique()
	.exec()
	.sort()
	.join(",");
// var CATEGORY = $.merge(, PARAMS.get("category[]").join(","))

const pages = ($("#pager_links").children().length || 2) - 1;
const resultspp = $("tr.lista2").length;
Lockr.prefix = "RARBG_";
if (!Lockr.get("ipdata")) {
	$.get("https://api.ipdata.co/?api-key=test").then((ipdata) => {
		console.log("ipdata jquery")
		Lockr.set("ipdata", ipdata);
	});
}

function saveSearch() {
	if (!SEARCH.trim()) {
		showSearch();
		return false;
	}
	SEARCH = SEARCH.toLowerCase().trim();
	CATEGORY = CATEGORY.trim();

	var SID = CryptoJS.MD5(`${SEARCH} | ${CATEGORY}`).toString();

	const SearchDoc = SearchRef.doc(SID);
	SearchDoc.get().then((doc) => {
		if (doc.exists) {
			var data = doc.data();
			// var count = data.count + 1;

			var lastdate = new Date(data.lastdate);
			var mmt = moment(lastdate);
			var hours = moment().diff(mmt, "hours");
			var days = moment().diff(mmt, "days");

			var times = data.times;
			if (hours < 12) times.pop();
			times.push({
				date: Date.now(),
				aproximatedResults: pages * resultspp,
				url: window.location.href,
				ipdata: Lockr.get("ipdata"),
			});

			SearchDoc.update({
				// query: SEARCH,
				// category: CATEGORY,
				lastdate: Date.now(),
				lastdate_string: new Date().toLocaleString(),
				times: times,
				count: times.length,
				aproximatedResults: pages * resultspp,
				url: window.location.href,
				ipdata: Lockr.get("ipdata"),
			}).then(showSearch);
		} else {
			SearchDoc.set({
				query: SEARCH,
				category: CATEGORY,
				lastdate: Date.now(),
				lastdate_string: new Date().toLocaleString(),
				times: [Date.now()],
				count: 1,
				url: window.location.href,
				ipdata: Lockr.get("ipdata"),
				aproximatedResults: pages * resultspp,
			}).then(showSearch);
		}
	});
}

function showSearch() {
	SearchRef.orderBy("lastdate", "desc")
		.get()
		.then((q) => {
			q.forEach((doc) => {
				console.log(doc.data());
			});
		});
}

saveSearch();
const $tr = $("tr.lista2");

$tr.each((i, tr) => {
	var $td = $(tr).children("td");
	var $category = $td.eq(0);
	var $file = $td.eq(1);
	var $added = $td.eq(2);
	var $size = $td.eq(3);
	var $uploader = $td.eq(7);

	var $name = $file.find("a").eq(0);
	var thumbnail = getThumbnail($name);
	if (thumbnail) {
		var poster = getPoster(thumbnail);
	}
	var bytes = new nstring($size.text()).fileSize();
	var categoryID = getCategoryID($category);

	categoryDom($category, {
		poster: poster || new n$img().error(),
		thumbnail: thumbnail || new n$img().error(),
	});

	fileDom($file, {
		size: $size.text(),
	});

	addedDom($added);

	sizeDom($size, {
		bytes: bytes,
	});
	uploaderDom($uploader);

	var classes = getClass({
		name: $name.text(),
		bytes: bytes,
		categoryID: categoryID,
	});
	$name.addClass(classes);
	$size.addClass(classes);
});

function categoryDom($category, data) {
	$category
		.find("img")
		.attr("src", data.poster)
		.addClass("nthumbnail")
		.parents("td:first")
		.css({ maxWidth: "300px" });

	var href = $category.find("a").prop("href");
	var categoryID = getCategoryID($category);

	$category
		.find("a")
		.attr({
			href: data.poster,
			target: "_blank",
		})
		.after(
			$(
				`<center><a href="${href}" target="_blank"> [${categoryID}]</a></center>`
			)
		);
}

function fileDom($file, data) {
	var $name = $file.find("a").eq(0);
	$name.text($name.text() + ` [${data.size}]`);

	hoverImage($name);
	var href = $name.prop("href");
	var url = new nurl(href).setParam("search", SEARCH || "").toString();
	$name.prop("href", url);
}

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

function sizeDom($size, data) {}

function uploaderDom($uploader) {}

function getCategoryID($category) {
	var href = $category.find("a").prop("href");
	var params = new nurl(href).getParams();
	return params.getAll("category").join(",");
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
	console.log("nmovie", movie);
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
	var path = new URL(thumbnail).pathname;
	var so_char = path.split("/")[2] ? path.split("/")[3].charAt(0) : "";

	var poster = thumbnail;
	poster = thumbnail
		.replace("/static/over/", `/posters2/${so_char}/`)
		.replace("/over_opt.", "/poster_opt.")
		.replace("_small.", "_banner_optimized.");

	return poster;
}
function hoverImage($el) {
	var thumbnail = getThumbnail($el);
	if (!thumbnail) return false;
	var poster = getPoster(thumbnail);
	var el = $el[0];
	el.onmouseover = function () {
		return overlib(
			`<img 
				style="max-height:500px" 
				src="${poster}" 
				border=0 
				onerror="this.src='${thumbnail}'"/>`
		);
	};
}

function blackFooter() {
	for (var i = 0; i < 3; i++) {
		$("body").append(
			$(`<img src="https://i.imgur.com/RpqqCgl.jpg"></img>`)
		);
	}
}
blackFooter();
