// ==UserScript==
// @name RarbgTorrent
// @namespace RarbgTorrent Script
// @match *://rarbgweb.org/torrent/*
// @grant none
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js?a=2
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/acescript/rarbg/torrent3.result.js?a=1
// ==/UserScript==

new ndom()
	.addStyleOnce(
		"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
		"font-awesome"
	)
	.addStyle(
		"https://jav-user.github.io/acescript/rarbg/torrent-vue/torrent-vue.css",
		"torrent-vue-css"
	)
	/*	.addStyle(
		"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
		"materialize-css"
	)*/
	// .addStyle(
	// 	"https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
	// 	"bootstrap-css"
	// )
	.addStyleOnce(
		"https://cdn.bootcdn.net/ajax/libs/bttn.css/0.2.4/bttn.css",
		"bttn-css"
	);

const RarbgRef = db.collection("RARBG").doc("RARBG");
const PluginsList = RarbgRef.collection("plugins_");
// const HistoryRef = RarbgRef.collection("history_");
// const UploadersRef = RarbgRef.collection("uploaders_");

// console.log("scripts...");

// $("h1").parents("table:first").attr("id", "vform");
// $("body").attr("id", "torrent-app");

// $(document).ready(function () {

// });
const $table = $("table.lista").eq(0);
const TableData = {};
const Torrent = {};
const Images = {};
$table.before(`<div id="vform"><vform></vform></div>`);
