// ==UserScript==
// @name TVCalendar
// @namespace TVCalendar Scripts
// @match https://www.pogdesign.co.uk/cat/*
//// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.6/handlebars.min.js
//// @require https://jav-user.github.io/acescript/tvcalendar/tvcalendar.js
// @grant none
// ==/UserScript==
//

var _whiteblue = "#66bbff";
var _darkblue = "darkblue";
//"#66bbff";

$(document).ready(() => {
  $("hea").append(`<style>
.day, .today{
font-weight:bold;
}

.day .white{
  color: white !important;
}

.day .whiteblue{
  color: #66bbff !important;
}

.today .whiteblue {
  color: black !important;
} 

.today .white {
  color: darkblue !important;
} 
</style>`);

  $("div.ep.info").each((i, ep) => {
    var whiteblue = _whiteblue;
    const $parent = $(ep).parents(".today:first");
    console.log($parent.length);
    if ($parent.length) {
      whiteblue = _darkblue;
    }
    const $ep = $(ep);
    const $a = $ep.find("a");
    const $p = $ep.find("p");
    const title = $a
      .eq(0)
      .text()
      .trim()
      .replace("Agents of SHIELD", "Agents of S.H.I.E.L.D.");

    const number = $a.eq(1).text().trim();
    const episode = title + " " + number;

    const aTmpl = Handlebars.compile(`
          <a 
              href="{{url}}" 
              target="_blank" 
              style="display:inline-block; color: {{color}} !important; font-weight: bold">
              {{order}}
            </a>`);
    const mainTmpl = Handlebars.compile(
      `<span style="font-weight: bold !important">{{name}}<br/>{{{title}}} {{{seed}}} {{{down}}} {{{date}}}</span><hr/>`
    );

    function rarbg() {
      const urlTmpl = Handlebars.compile(
        `https://rarbgweb.org/torrents.php?category=18;41;49&search={{episode}}&order={{order}}&by=DESC`
      );
      const urlDate = urlTmpl({ episode: episode, order: "data" });
      const urlSeed = urlTmpl({ episode: episode, order: "seeders" });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seed" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "RARBG" }));
    }

    function subdivx() {
      const urlTmpl = Handlebars.compile(
        `http://subdivx.com/index.php?buscar={{episode}}&accion=5&{{{order}}}`
      );

      const urlTitle = urlTmpl({ episode: episode });
      const urlDate = urlTmpl({ episode: episode, order: "oxfecha=2" });
      const urlDown = urlTmpl({ episode: episode, order: "oxdown=1" });
      console.log(urlDate, urlDown);

      const aTitle = aTmpl({ url: urlTitle, color: whiteblue, order: "title" });
      const aDown = aTmpl({ url: urlDown, color: "white", order: "down" });
      const aDate = aTmpl({ url: urlDate, color: whiteblue, order: "date" });

      return $(
        mainTmpl({
          title: aTitle,
          date: aDate,
          down: aDown,
          name: "SUBDIVX",
        })
      );
    }

    $a.last().after(subdivx()).after(rarbg());
  });
});
