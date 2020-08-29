// ==UserScript==
// @name TVCalendar
// @namespace TVCalendar Scripts
// @match https://www.pogdesign.co.uk/cat/
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://jav-user.github.io/acescript/tvcalendar/tvcalendar.js
// @grant none
// ==/UserScript==

$(".ep").each((i, ep) => {
  const $ep = $(ep);
  const $a = $ep.find("a");
  const title = $a
    .eq(0)
    .text()
    .trim()
    .replace("Agents of SHIELD", "Agents of S.H.I.E.L.D.");

  const number = $a.eq(1).text().trim();
  const episode = title + " " + number;

  var udate = `https://rarbgweb.org/torrents.php?category=18;41;49&search=${episode}&order=data&by=DESC`;
  var useed = `https://rarbgweb.org/torrents.php?category=18;41;49&search=${episode}&order=seeders&by=DESC`;

  var date = `<a href="${udate}" target="_blank" style="display:inline-block; color: white !important">date</a>`;
  var seed = `<a href="${useed}" target="_blank" style="display:inline-block; color: #66bbff !important" >seed</a>`;

  var rarbg = `<span>Rarbg<br/>${seed} ${date}</span>`;

  ///console.log("rarbg", rarbg);

  $a.last().after($(rarbg));
});
