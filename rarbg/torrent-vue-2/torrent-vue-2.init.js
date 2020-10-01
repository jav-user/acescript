
const RarbgRef = db.collection("RARBG").doc("RARBG");
const PluginsList = RarbgRef.collection("plugins_");

const $table = $("table.lista").eq(0);
const TableData = {};
const Torrent = {};
const Images = {};

$table.before(`<div id="vform"><vform></vform></div>`);

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);