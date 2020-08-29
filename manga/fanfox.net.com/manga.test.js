// ==UserScript==
// @name MangaFox Manga
// @namespace MangaFox Manga Scripts
// @match http://fanfox.net/manga/*/
// @require https://jav-user.github.io/scripts/nes/nes_functions.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant none
// ==/UserScript==

nes.addStyle(
	"https://jav-user.github.io/scripts/mangaplugins/fanfox.net/manga.css",
	"manga-css"
);

var manga,
	$menu,
	$lista,
	$chapters,
	chapters = {};

function createGUI() {
	manga = $(".detail-info-right-title-font").text().toValidFileName();
	$lista = $("ul.detail-main-list");
	$chapters = $lista.children("li");
	$menu = $(
		`<span class='nes'>
			<input type='checkbox' name='select-all' onchange="selectAll()"/>
			<label>Select All</label>
			<button name='get-interval' onclick="getInterval()">Get Interval</button>
			<button name='get-selected' onclick="getSelected()">Get Selected</button>
			<button name="copy-selected" onclick="copySelected()">Copy Selected</button>
		</span>`
	);

	// $menu.find(`[name=select-all]`).on("change", selectAll);
	// $menu.find(`[name=get-interval]`).on("click", () => getInterval());
	// $menu.find(`[name=get-selected]`).on("click", () => getSelected());
	// $menu.find(`[name=copy-selected]`).on("click", () => copySelected());

	$lista.parent().parent().before($menu);

	$chapters.each((i, li) => {
		var $chapter = $(li);
		$chapter.show();
		var chapter = {
			url: $chapter.find("a")[0].href,
			name: $chapter.find(".title3").text().trim().toValidFileName(),
			$chapter: $chapter,
		};

		chapter.id = getChapterId($chapter);
		chapters[chapter.id] = chapter;

		var $selector = $(`	
			<span>
				<hr/>
				<input type='checkbox' name="select"/>
			</span> `);

		var $btns = $(`
			<span class='nes'>
				<span>
					<button  name="get">Get pages</button>
					<button  name="copy">Copy</button>
				</span>
				<hr/>
			</span>
			`);

		var $select = $selector.find("[name=select]");
		var $get = $btns.find("[name=get]");
		var $copy = $btns.find("[name=copy]").hide();

		$select.on("change", () => selectChapter(chapter));
		$get.on("click", () => getChapter(chapter.id));
		$copy.on("click", () => copyChapter(chapter.id));

		$chapter.find("a").before($selector).after($btns);
	});
	menuCtrl();
}

async function getInterval() {
	console.log("interval....");
	var [start, end] = getSelectedIds();
	var ids = [];
	$chapters.each((i, chapter) => {
		var id = getChapterId($(chapter));
		if (id >= start && id <= end) {
			//$(chapter).find("[name=select]").prop("checked",true).trigger("change")
			ids.push(id);
		}
	});
	ids = ids.sort();
	ids = ids.filter((id) => !chapters[id].cmdlines);

	console.log("ids", ids);

	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		console.log("id", id);
		await new Promise((solve) => getChapter(id, solve));
		chapters[id].$chapter
			.find("[name=select]")
			.prop("checked", true)
			.trigger("change");
	}
}

var getChapterId = ($chapter) => {
	console.log("$chapter", $chapter);
	var name = $chapter.find(".title3").text().trim().toValidFileName();
	return name.split("-")[0].trim();
};

var menuCtrl = () => {
	var $selected = $chapters.find("input:checked");
	$menu.find(`[name=get-interval]`).attr("disabled", $selected.length != 2);
	$menu
		.find(`[name=get-selected]`)
		.attr("disabled", $selected.length == 0)
		.text(`Get selected (${$selected.length})`);
	$menu
		.find(`[name=copy-selected]`)
		.attr("disabled", $selected.length == 0)
		.text(`Copy selected (${$selected.length})`);
};

var chaptersCtrl = () => {
	$chapters.each((i, chapter) => {
		var checked = $(chapter).find("input[type=checkbox]").prop("checked");
		$(chapter).toggleClass("selected", checked);
	});
};



/**
 *
 *
 *
 *
 */

function selectAll() {
	var isChecked = this.checked;
	$chapters.find("input[type=checkbox]").each((i, chck) => {
		$(chck).prop("checked", isChecked).trigger("change");
	});

	//.prop("checked", this.checked).trigger("change");
	//$chapters.find("input[type=checkbox]").each((i,chck)=>{
	//var isChecked = $(chck).prop("checked");
	//console.log("isChecked ",isChecked )
	//prop("checked", this.checked);
	//})
	menuCtrl();
	chaptersCtrl();
}

// function getInterval() {}

function selectChapter() {
	menuCtrl();
	chaptersCtrl();
}

function copyChapter(id) {
	var lines = chapters[id].cmdlines;
	var cmd = `D:\n${lines.join("\n")}\n`;
	console.log(cmd);
	nes.copy(cmd);
}

function getSelectedIds() {
	return Array.from($lista.children("li.selected"))
		.map((chapter) => getChapterId($(chapter)))
		.sort();
}

async function getSelected() {
	var ids = getSelectedIds();
	ids = ids.filter((id) => !chapters[id].cmdlines);
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		await new Promise((solve) => getChapter(id, solve));
	}

	console.log(chapters);
}

function copySelected() {
	var cmdlines = [];
	var ids = getSelectedIds();
	console.log("ids", ids);
	ids.forEach((id) => {
		var lines = chapters[id].cmdlines;
		if (lines) $.merge(cmdlines, lines);
	});

	// var lines = chapters[id].cmdlines;
	var cmd = `D:\n${cmdlines.join("\n")}\n`;
	console.log(cmd);
	nes.copy(cmd);
	alert(`Copied ${ids.length} chapters and ${cmdlines.length} pages.`);
}

async function getChapter(id, solve) {
	var chapter = chapters[id];

	chapter.$chapter
		.find("button[name=get]")
		.removeClass("success")
		.addClass("processing");

	var lines = await $.get(chapter.url).then((html) => {
		var chapterid = getChapterCID(html);
		var key = $(html).find("#dm5_key").val();
		var numpages = Array.from($(html).find("a[data-page]"))
			.map((a) => $(a).attr("data-page"))
			.sort((a, b) => a - b)
			.pop();

		var $data = {
			url: "chapterfun.ashx",
			data: {
				cid: chapterid,
				page: 1,
				key: key,
			},
			type: "GET",
		};

		var data = {
			numpages: numpages,
			manga: manga,
			chapter: chapter.name,
			server: "MangaFox",
			$html: chapter.$chapter.find("[name=get]"),
		};

		// console.log($data, data);

		return ajaxChapter($data, data).then((res) => {
			chapter.$chapter.find("[name=copy]").show();
			console.log("res", res);
			return res;
		});
	});

	chapters[id].cmdlines = lines;
	// console.log(chapters[id]);
	chapter.$chapter
		.find("button[name=get]")
		.removeClass("processing")
		.addClass("success");
	if (solve) solve();
}

var getChapterCID = (html) => {
	var test = html.match("var[ ]{0,}chapterid[ ]{0,}=[0-9]{1,};");
	var testid = test[0].match("[0-9]{1,}");
	return testid[0];
};

async function ajaxChapter($data, data) {
	var pages = [];
	var setPages = (msg) => {
		eval(msg);
		// console.log("d", d.length);
		d.forEach((url) => pages.push(url));
		pages = pages.unique();

		return pages.length == data.numpages;
	};

	for (var i = 1; i <= data.numpages; i++) {
		$data.data.page = i;
		// console.log("i... " + i);
		var completed = await $.ajax($data).then(setPages);

		var percent = pages.length / (data.numpages / 100);
		var _percent = Number.parseFloat(percent).toFixed(2);
		var txt = `${_percent}% (${pages.length} of ${data.numpages}) (${i} it.)`;
		// console.log(txt);
		data.$html.text(txt);

		if (completed) break;
	}

	var iterations = $data.data.page;
	console.log("iterations ", iterations);
	console.log("pages ", pages);

	var _lines = chapterToCmdLines(pages, data);

	return _lines;
}

/**
 *
 *
 */

var chapterToCmdLines = (images, data) => {
	var lines = [];
	var host = window.location.hostname;
	var webname = data.server ? `${data.server} (${host})` : host;
	images.forEach((img, i) => {
		var pageNum = `00000000000000${i + 1}`.substr(-5);
		var url = img.replace(/^\/\//, "https://");
		lines.push(
			`nddown "${url}==${pageNum}" "${data.manga}/${data.manga} - ${data.chapter} (${window.location.hostname}) ${images.length}pp" "${webname}"`
		);
	});
	return lines;
};


createGUI();