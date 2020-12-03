// ==UserScript==
// @name HLA
// @namespace HLA Scripts
// @match https://hentaila.com/*
// @require https://jav-user.github.io/acescript/common/nes-1.0.2.js
// @grant none
// ==/UserScript==




async function pimpEps() {
	var $eps = Array.from($("a.lnk-blk.fa-play"));

	for (var ep of $eps) {
		var url = $(ep).prop("href");
		await $.get(url).then((html) => {
			//console.log(res)
			var $links = Array.from($(html).find(".download-links a"));
			var links = $links.map((link) => {
				var url = $(link).prop("href");
				var host = new URL(url).hostname
					.split(".")
					.reverse()
					.slice(0, 2)
					.reverse()
					.join(".");

				var $link = $(
					`
					<small>
						<a 
							href="${url}"
							data-host="${host}" 
							target="_blank">${host}</a> |
						<a 
							href="javascript:;" 
							title="copy all ${host}"
							class="copy-all">copy all<a> |
						<a 
							href="javascript:;" 
							class="copy"
							title="copy ${url}">copy<a>
					</small>`.trim()
				);

				$link.find(".copy").on("click", function () {
					new nstring(url).copy();
					alert("1 link copied!");
				});

				$link.find(".copy-all").on("click", function () {
					var urls = Array.from(
						$(`a[data-host="${host}"]`)
					).map((a) => $(a).prop("href")).reverse()
					new nstring(urls.join("\n")).copy();
					alert(`${urls.length} ${host} links copied!`);
				});
				return $link;
			});

			//console.log(links);
			var $div = $("<div class='custom-links'></div>");
			links.forEach((link) => $div.append(link).append("<br/>"));
			$(ep).parent().after($div);
		});
	}
}

pimpEps();