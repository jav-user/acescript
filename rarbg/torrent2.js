// ==UserScript==
// @name RarbgTorrent
// @namespace RarbgTorrent Script
// @match *://rarbgweb.org/torrent/*
// @grant none
// @require https://jav-user.github.io/acescript/common/nes.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrent.js?a=1
// ==/UserScript==

const Torrent = {},
	RawInfo = {},
	Plugins = {},
	PluginEditors = {};
var Images = [],
	$table = null,
	magnetParams = null;

const RarbgRef = db.collection("javuser").doc("Rarbg");
const ImgPluginsRef = RarbgRef.collection("imgPlugins");
// const MissingPluginsRef = RarbgRef.collection("missingPlugins");

const getPlugins = () => {
	return ImgPluginsRef.get().then((q) => {
		q.forEach((doc) => {
			var f = doc.data().f;
			if (f) Plugins[doc.id] = f;
		});

		return Plugins;
	});
};

const getRawInfo = () => {
	$table = $("table.lista").eq(0);
	// console.log("$table", $table);
	var $trs = $table.children("tbody").children("tr");
	$trs.each((i, tr) => {
		var $tds = $(tr).children("td");
		var key = $tds.eq(0).text().toLowerCase().replace(/[:]/g, "").trim();
		var val = {
			text: $tds.eq(1).text().replace(/[\n]/g, ""),
			html: `<div>${$tds.eq(1).html()}</div>`,
			$: $tds.eq(1),
		};
		// $tds.eq(1).text().replace(/[\n\t]/g," ").trim()
		RawInfo[key] = val;
	});
	return RawInfo();
};

const getTorrentInfo = () => {
	var nes = new Nes();
	Torrent.size = RawInfo.size.text;
	Torrent.bytes = nes.getFileSize(Torrent.size);
	Torrent.title = RawInfo.torrent.text.trim();
	Torrent.images = Images.map((Img) => Img.url);

	getMagnet();
};

const getImages = () => {
	var $d = RawInfo["description"].$;
	var $imgs = $d.find("img");
	$imgs.each((i, img) => {
		var image = {
			html: img,
			$: $imgs.eq(i),
			url: img.src,
			Url: new URL(img.src),
		};
		Images.push(image);
	});
	// console.log($imgs)
};


const createPluginHtml = (host, f) => {
	const $plugin = $(`
            <hr/>
            <span>
                <input type="hidden" name="host" value="${host}"/>
                <input name="fn" value='${f}'/>
                <button name="save">Save</button>
            </span>
            <br/>
            `);

	var $fn = $plugin.find("input[name=fn]");
	var $host = $plugin.find("input[name=host]");
	var $save = $plugin.find("button[name=save]");

	$fn.on("keyup", function () {
		Plugins[$host.val()] = $fn.val();
		replaceImages(host);
	});

	$save.on("click", function () {
		var fn = $fn.val();
		var host = $host.val();
		savePlugin(host, fn)
			.then(() => $save.css("color", "green"))
			.catch((err) => console.log("error", err));
	});
	PluginEditors[host] = $plugin;
	return $plugin;
};

const savePlugin = (host, f) => {
	console.log(host, f);
	return ImgPluginsRef.doc(host).set({ f: f });
};

const replaceImages = (host) => {
	Images.filter((Img) => !host || Img.Url.hostname == host).forEach((Img) => {
		var host = Img.Url.hostname;
		var imgSrc = Img.Url.href;
		var newSrc = imgSrc;
		var f = Plugins[host];
		if (f) {
			try {
				newSrc = eval(f);
			} catch (err) {
				console.log(f);
			}
		}
		Img.url = newSrc;
		let replaced = imgSrc != newSrc;

		Img.$.attr("src", newSrc)
			.css({
				maxWidth: replaced ? "750px" : "",
				borderWidth: "3px",
				borderColor: replaced ? "green" : "red",
			})
			.parent()
			.attr({ target: "_blank", href: newSrc });
		if (!Img.$plugin) {
			Img.$plugin = createPluginHtml(host, f);
			Img.$.parent().before(Img.$plugin);
		}

		Img.$plugin
			.find("input[name=fn]")
			.css("color", replaced ? "green" : "red");
	});

	//populateInfoHtml();
};

const createInfoForm = () => {
	console.log(Torrent);
	var $html = $(`<table class="lista" id="torrentInfo">
                  <tbody>
        		    <tr>
            			<td class="header2">title: </td>
            			<td class="lista"><input name="title" value='${Torrent.title}' size="${Torrent.title.length}"/></td>
        			</tr>
                    <tr>
            			<td class="header2">name: </td>
            			<td class="lista"><input name="name" value='${Torrent.name}' size="${Torrent.name.length}"/></td>
        			</tr>
                     <tr>
            			<td class="header2">Categories: </td>
            			<td class="lista"><input name="categories"/></td>
        			</tr>
                  </tbody>
                  </table><hr/>`);
	console.log($html.html());
	$table.before($html);
};

$(document).ready(() => {
	getRawInfo();
	getImages();

	getTorrentInfo();

	getPlugins().then(() => replaceImages());
	createInfoForm();

	$("input").on("keyup", function () {
		$(this).attr("size", $(this).val().length);
	});
});
