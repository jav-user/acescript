// ==UserScript==
// @name RarbgTorrents
// @namespace RarbgTorrents Script
// @match *://rarbgweb.org/torrents.php*
// @grant none
// @require https://jav-user.github.io/scripts/nes/nes_functions.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrent.js?a=1
// ==/UserScript==
// 
 


   function getParams(url){
    var Url = new URL(url)
    return new URLSearchParams(Url.search)
  }
  class nurl{
    constructor(url){
      this.Url = new URL(url)
      this.params = new  URLSearchParams(this.Url.search)
    }
    getParams(){
       return this.params
    }
    getParam(param){
       return this.params.get(param)
    }
    setParam(param, value){
      this.params.set(param, value)
      this.Url.search = this.params.toString()
      return this
    }
    getUrl(){
      return this.Url;
    }
    get(tag){
      return this.Url[tag];
    }
    
  }


    var Rarbg = db.collection("javuser").doc("Rarbg");
 var Params = new URLSearchParams(window.location.search)
    String.prototype.toByte = function () {
        var str = this.toString();
        var bytes = 0;
        var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        sizes.forEach((size, i) => {
            if (str.endsWith(size)) {
                bytes = str.replace(size, "").trim() * Math.pow(1000, i);
                return false;
            }
        });
        return bytes;
    };

    document.querySelectorAll(".lista2t a[title][onmouseover]").forEach((v) => {
        if (v.onmouseover) {
            var omo = v.onmouseover.toString();
            var url = omo.split("'")[2].split("\\")[0];
            var td = v.parentNode.parentNode.querySelector("td");
            td.align = "center";
            var img = v.parentNode.parentNode.querySelector("img");
            img.src = url;
            var poster = url;
            var num = url.split("/")[5]
                ? poster.split("/")[5].substr(0, 1)
                : "";
            poster = url
                .replace("/static/over/", `/posters2/${num}/`)
                .replace("/over_opt.", "/poster_opt.")
                .replace("_small.", "_banner_optimized.");
            console.log("poster", poster);

            //   console.log("url",url)
            //             var poster = url.split("/")
            //             poster[3] = 'posters2'
            //             poster[4] = poster[5] ? poster[5].substr(0, 1) : ""
            //             poster = poster.join("/")
            v.onmouseover = function () {
                return overlib(
                    `<img style="max-height:500px" src="${poster}" border=0 onerror="this.src='${url}'"/>`
                );
            };
        }
    });

    var img = document.createElement("img");
    img.src = "https://i.imgur.com/RpqqCgl.jpg";

    for (var i = 0; i < 3; i++) {
        document.querySelector("body").append(img);
    }

    var seasons = function () {
        var ss = [];
        for (var i = 1; i <= 99; i++) {
            var num = "000000" + i;
            var season = "S" + num.substr(-2);
            ss.push(season);
        }
        return ss;
    };

    Array.from(document.querySelectorAll(".lista2t a"))
        .filter((a) => a.href.includes("/torrent/"))
        .forEach((a) => {
            var size = a.parentNode.parentNode.children[3];
            var bytes = size.innerText.toByte();
            var isSeason = false;

            seasons().forEach((season) => {
                if (
                    a.innerText.includes("." + season + ".") &&
                    bytes < "10GB".toByte()
                ) {
                    a.style.color = "purple";
                    a.style.fontSize = "12px";
                    size.style.color = "purple";
                    size.style.fontWeight = "bold";
                    isSeason = true;
                }
            });

            if (!isSeason && bytes < "1GB".toByte()) {
                a.style.color = "blue";
                // a.style.fontSize = "12px"
                size.style.color = "blue";
                size.style.fontWeight = "bold";
            }

            if (a.innerText.includes("ION10")) {
                a.style.color = "green";
                a.style.fontSize = "12px";
                size.style.color = "green";
                size.style.fontWeight = "bold";
            }
        });

    $(".lista2t")
        .find("tr.lista2")
        .each((i, tr) => {
      //var params = getParams();
     //console.log(params.get("search"))
      
            var $tds = $(tr).find("td.lista");
      var $a = $tds.eq(1).find("a")
            console.log($tds)
            var href =$a[0].href
            var Url = new nurl(href)
            Url.setParam("search",Params.get("search"))
            
            $a.attr("href",Url.getUrl())
            //console.log( $tds.eq(0), $tds.eq(1), $tds.eq(2))
            //console.log(href)
            //var url = new URL(href)
            //var fileParams = URLSearchParams(url.search)
            //fileParams.set("search",params.get("search"))
            //$file.find("a").attr("href",url.toString())
            var added = $tds.eq(2);
      console.log(added)
            console.log(added.text());
            var dtBerlin = moment.tz(added.text(), "Europe/Berlin");
            var dt = dtBerlin.clone().tz(nes.getTimezone());
            added.attr("title", dt.format("YYYY-MM-DD hh:mm:ss a"));
            added.text(dt.fromNow());
        });

