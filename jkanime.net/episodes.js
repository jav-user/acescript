// ==UserScript==
// @name JKAnime
// @namespace JKAnime Scripts
// @match https://jkanime.net/*/
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js
// @require http://rawgit.com/notifyjs/notifyjs/master/dist/notify.js
// @grant none
// ==/UserScript==

$(".custom_links").remove();
async function pimpEps() {
	$("#sidebar-2").after(
		$(`
			<table 

				id="tbl-links" 
				class="custom_links"
				style="float:right; width:300px; border:none">
				<tbody></tbody>
			</table>`)
			.hide()
			.fadeIn(2000)
	);

	var $eps = Array.from($("div.cap-post")).reverse(); //
	// .slice(0, 3);

	for (var ep of $eps) {
		var url = $(ep).find("a.cap-play").prop("href");
		var title = $(ep).find(".cap-header").text();

		await $.get(url).then((html) => {
			var links = getLinks(html);
			pimpLinks(links, title);
			$("#tbl-links").find("tr,td").css("border", "none");
			//console.log(_links)
			// var $links = $(_links);
			// $links.find("tr, td").css({ border: "none" });
			// $links.find("td").css("width", "10px");
			// $("#tbl_links").append($links);
			//$("#sidebar-2").after(_links)
		});
	}
}

function pimpLinks(links, title) {
	$("#tbl-links > tbody").append(
		$(`
				<tr>
					<td colspan="3">
						<h3>${title}</h3>
					</td>
				</tr>`)
			.hide()
			.fadeIn()
	);
	links.forEach((link) => {
		var _host = new URL(link).hostname;
		var host = _host.split(".").reverse().slice(0, 2).reverse().join(".");

		var $link = $(`
				<tr>
					<td>
						<a 
							data-host="${host}"
							target="_blank"
							href="${link}">
							${host}
						</a>
					</td>
					<td>
						<button name="copy">copy</button>
					</td>
					<td>
						<button name="copy-all">copy all</button>
					</td>
				</tr>
			`);
		$link.find("[name=copy]").on("click", function () {
			copy(link, host);
		});

		$link.find("[name=copy-all]").on("click", function () {
			copyAll(host);
		});
		$("#tbl-links > tbody").append($link.hide().fadeIn(2000));
	});
}

function getLinks(html) {
	var $links = $(html).find("#basic-modal-content a");

	return Array.from($links).map((link) => link.href);
}

$("#sidebar-2").after(
	$("<button>show episode links</button>")
		.on("click", function () {
			pimpEps();
			$(this).remove();
		})
		.hide()
		.fadeIn(2000)
);

function copyAll(host) {
	var arr = Array.from($(`a[data-host="${host}"]`)).map((a) => a.href);
	new nstring(arr.join("\n")).copy();
	$.notify(`copied ${arr.length} ${host}`, "success");
}

function copy(url, host) {
	new nstring(url).copy();
	$.notify(`copied ${host}`, "info");
}
