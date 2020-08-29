// ==UserScript==
// @name MangaFox Manga
// @namespace MangaFox Manga Scripts
// @match http://fanfox.net/manga/*/
// @require https://jav-user.github.io/acescript/common/nes.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant none
// ==/UserScript==

var nes = new Nes();

nes.addStyle(
	"https://jav-user.github.io/acescript/manga/fanfox.net/manga.view.css",
	"manga-css"
);