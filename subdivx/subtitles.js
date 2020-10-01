// ==UserScript==
// @name Subdivx
// @namespace Subdivx Scripts
// @match https://www.subdivx.com/index.php
// @grant none
// ==/UserScript==

//clear()
var $links = Array.from($("a.titulo_menu_izq"));

var $foots = $("div#buscador_detalle_sub_datos");

async function getLinks() {
	for (var i in $links) {
		var link = $links[i];

		await $.get(link.href).then((res) => {
			var $html = $(res.trim());
			var $link = $html.find("a.link1");
			var href = $link.prop("href");
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
						title="${desc}" 
						target="_blank"
						href="${href}">
							descargar
					</a>
				</b>`
				)
				.children(":last")
				.hide()
				.fadeIn(2000);
		});
	}
}

getLinks();
