// ==UserScript==
// @name Subdivx
// @namespace Subdivx Scripts
// @match https://www.subdivx.com/index.php
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js
// @grant none
// ==/UserScript==

//clear()
//
//

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

var $links = Array.from($("a.titulo_menu_izq"));

var $foots = $("div#buscador_detalle_sub_datos");

async function getLinks() {
	for (var i in $links) {
		var link = $links[i];

		await $.get(link.href).then((res) => {
			var $html = $(res.trim());
			var $link = $html.find("a.link1");
			var href = $link.prop("href");
			var host = new URL(href).hostname;
			console.log(href);
			// var data = $html.find("div#detalle_datos_derecha");
			var $desc = $html.find("#detalle_datos font");
			var desc =
				$desc.text().replace(/\"/g, "'").substring(0, 100) + "...";

			$foots
				.eq(i)
				.append(
					`| 
				<b>
					<a
                        class="custom_download"
						title="${desc}" 
						target="_blank"
						href="${href}">
							descargar (${host})
					</a>
				</b>`
				)
				.children(":last")
				.hide()
				.fadeIn(2000)
				.find("a")
				.css("color", host == "www.subdivx.com" ? "green" : "red");
		});
	}

	///  var $btn = $("<button>Download All</button>")

	var $head = $(".result_busc3");

	$head
		.append(`<button>Download All</button>`)
		.children(":last")
		.hide()
		.fadeIn(2000)
		.on("click", downloadAll);
	$head
		.append(`<button>Copy All</button>`)
		.children(":last")
		.hide()
		.fadeIn(2000)
		.on("click", copyAll);
}

async function downloadAll() {
	var $links = Array.from($("a.custom_download"));

	for (var link of $links) {
		await timeout(1000);
		link.click();
	}
}

function copyAll() {
	var links = Array.from($("a.custom_download"))
		.map((link) => link.href)
		.join("\n");
	new nstring(links).copy();
	console.log("links", links);
}
getLinks();
