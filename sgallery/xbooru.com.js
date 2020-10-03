// ==UserScript==
// @name Xbooru
// @namespace Xbooru Scripts
// @match https://xbooru.com/index.php
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @grant none
// ==/UserScript==

var $ = window.jQuery; //OR
//var $ = window.$;

var SEARCH = new URLSearchParams(window.location.search);
var S = SEARCH.get("s");

function view(interval) {
  var $img = $("#image");
  if ($img.length) {
    $img.css({
      width: "100%",
      height: "100%",
    });

    console.log("done...", $img[0]);
    clearInterval(interval);

    setTimeout(() => {
      $img.wrap(`<a href="${$img.prop("src")}" target="_blank"></a>`);
    }, 1000);
  }
}

function blacklisted(str) {
  var isBlack = false;
  var blacklist = ["furry", "fox", "interspecies"];
  blacklist.forEach((word) => {
    if (str.split(" ").indexOf(word) != -1) {
      isBlack = true;
    }
  });

  return isBlack;
}

async function list() {
  var $imgs = Array.from($("img.preview"));
  //.slice(0, 10);

  for (var img of $imgs) {
    await $.get(img.parentNode.href).then((html) => {
      var src = $(html).find("#image").prop("src");
      console.log(src);
      img.src = src;

      $(img)
        .removeAttr("height width")
        .css({
          maxWidth: "100%",
          maxHeight: "100%",
          border: "1px solid black",
          zIndex: 1,
          position: "relative",
          opacity: blacklisted($(img).attr("title")) ? 0.15 : 1,
        })
        .hide()
        .fadeIn(2000)
        .on("mouseover", function () {
          $(this)
            .css({ zIndex: 9 })
            .animate(
              { border: "none", maxWidth: "200%", maxHeight: "150%" },
              0.1 * 1000
            );
        })
        .on("mouseout", function () {
          $(this).animate(
            {
              border: "1px solid black",
              zIndex: 1,
              maxWidth: "100%",
              maxHeight: "100%",
            },
            0.1 * 1000
          );
        })
        .parent()
        .attr("target", "_blank")
        .css({ width: "100%", height: "100%" })
        .parent()
        .css({
          height: "350px",
        });
    });

    await timeout(0.0 * 1000);
  }
}

async function timeout(ms) {
  return new Promise((solve) => {
    setTimeout(() => {
      solve();
    }, ms);
  });
}

window.onload = function () {
  var interval = setInterval(() => {
    if (S == "view") view(interval);
  }, 0.001 * 1000);

  setTimeout(() => {
    if (S == "list") list();
    clearInterval(interval);
  }, 0.5 * 1000);
};
