// ==UserScript==
// @name AnimeFlvEps
// @namespace AnimeFlvEps Scripts
// @match https://www3.animeflv.net/anime/*
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js
// @grant none
// ==/UserScript==

$(".custom-links").remove();
async function getLinks() {
	var $episodes = Array.from($("#episodeList li"));
	for (var ep of $episodes) {
		var link = $(ep).find("a").prop("href");

		await $.get(link).then((html) => {
			var $links = Array.from($(html).find("a.Button.Sm.fa-download"));
			//console.log($links)
			var links = $links
				.map((a) => a.href)
				.sort()
				.map((link) => {
					var host = new URL(link).hostname;
					var arr = host.split(".");
					var host = arr.slice(arr.length - 2).join(".");

					var $link = $(
						`
						<small> &nbsp;   
							<a class="custom-link"
								target="_blank"
								data-host="${host}" 
								href="${link}">${host}
							</a> |
							<a 
								class="copy-all"
								href="javascript:;"
								style="color:purple"
								title="copy all ${host}"
								>
								copy all
							</a> |
							<a 
								class="copy" 
								href="javascript:;"
								title="copy ${link}"
								style="color:blue">copy
							</a>
						</small>
						<br/>`.trim()
					);

					$link.find(".copy").on("click", function () {
						new nstring(link).copy();
						alert(`${host} copied!`);
					});

					$link.find(".copy-all").on("click", function () {
						// var links = Array.from($(".custom-link")).map(a=>a.href).reverse().filter()
						var links = Array.from($(`*[data-host="${host}"]`))
							.reverse()
							.map((a) => a.href);

						console.log(links);
						new nstring(links.join("\n")).copy();
						alert(`${links.length} ${host} links copied!`);
					});

					return $link;
				});
			var $div = $(`<div class='custom-links'></div>`);
			links.forEach((link) => $div.append(link));

			$(ep).after($div.hide().fadeIn(2000));
		});
	}
}

$(document).ready(function () {
	setTimeout(() => {
		getLinks();
		console.log("ready...");
	}, 1 * 1000);
});
