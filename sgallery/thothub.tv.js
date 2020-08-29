// ==UserScript==
// @name Thothub.tv
// @namespace Thothub.tv Scripts
// @match *://thothub.tv/*
// @require https://code.jquery.com/jquery-3.5.1.js
// @require https://jav-user.github.io/scripts/nes/nes_functions.js
// @require https://jav-user.github.io/acescript/common/images.js
// @grant none
// ==/UserScript==

var $el = $(`
<div>
  <button name="get-gallery">Get gallery</button>
</div>
`);

$("body").prepend($el);

$el.find("button[name=get-gallery]").on("click", getGallery);

function getGallery() {
	var data = document.querySelector(".mace-gallery-teaser").dataset.g1Gallery;

	var gallery = JSON.parse(data);

	var images = gallery
		.filter((g) => g.type == "image")
		.map((img) => img.full)
		.sort();
	var cmdLines = getLines(images);
	nes.copy(cmdLines);
	alert("copied " + images.length + " images");
}

 