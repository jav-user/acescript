// ==UserScript==
// @name Xbooru
// @namespace Xbooru Scripts
// @match https://xbooru.com/index.php
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lockr/0.8.5/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @grant none
// ==/UserScript==

var $ = window.jQuery; //OR
//var $ = window.$;
Lockr.prefix = "Xbooru_";

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

async function list() {
  var $imgs = Array.from($("img.preview"));
  //.slice(0, 10);
  var ajax = [];
  for (var img of $imgs) {
    if (blacklisted(img)) {
      $(img)
        .css("opacity", 0.15)
        .on("mouseover", function () {
          $(this).css("opacity", 1);
        })
        .on("mouseout", function () {
          $(this).css("opacity", 0.15);
        })
        .parent()
        .attr("target", "_blank");
      continue;
    }
    var href = img.parentNode.href;
    var id = CryptoJS.MD5(href).toString();
    // console.log("id", id);

    var src = Lockr.get(id);
    if (href && src) {
      pimpImage(img, src == "video" ? null : src);
      console.log("lockrsrc", src);
      continue;
    }

    await $.get(img.parentNode.href).then((html) => {
      if ($(html).find("#gelcomVideoPlayer").length) {
        Lockr.set(id, "video");
        return false;
      }
      var src = $(html).find("#image").prop("src");
      // console.log("href", href, "src", src);

      ajax.push({
        // id:id,
        img: img,
        _src: img.src,
        href: href,
        src: src,
      });

      Lockr.set(id, src);
      pimpImage(img, src);
    });

    await timeout(0.0 * 1000);
  }

  console.log("ajax", ajax, ajax.length);
}

function blacklisted(img) {
  var keyWords = $(img).attr("title").split(" ");
  var isBlack = false;
  var blacklist = [
    "anthro",
    "crash_bandicoot_(series)",
    "furry",
    "fox",
    "futanari",
    "hybrid",
    "interspecies",
    "lion",
    "my_little_pony",
    "rabbit",
    "sonic_(series)",
    "vixen",
    "yaoi",
  ];
  blacklist.forEach((blackWord) => {
    if (keyWords.indexOf(blackWord) != -1) {
      isBlack = true;
    }
  });

  return isBlack;
}
function pimpImage(img, src) {
  // console.log("src", src);
  if (src) {
    img.src = src;
  }
  var opacity = $(img).css("opacity");

  $(img)
    .removeAttr("height width")
    .css({
      maxWidth: "100%",
      maxHeight: "100%",
      border: "1px solid black",
      zIndex: 1,
      position: "relative",
    })
    .hide()
    .fadeIn(2000)
    .on("mouseover", function () {
      $(this)
        .css({ zIndex: 9 })
        .animate(
          { border: "none", maxWidth: "170%", maxHeight: "500%", opacity: 1 },
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
          opacity: opacity,
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
  if (!src) {
    $(img).css("border", "2px solid blue");
    //return false;
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
  }, 0.05 * 1000);
};
