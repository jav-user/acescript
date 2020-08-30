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

$(document).ready(function () {
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

const pages = ($("#pager_links").children().length || 2) - 1;
const resultspp = $("tr.lista2").length;

var SID = CryptoJS.MD5(`${SEARCH} | ${CATEGORY}`).toString();
const SearchDoc = SearchList.doc(SID);
const AccessList = SearchDoc.collection("access");
