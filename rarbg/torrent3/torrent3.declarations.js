const Form = {},
	Torrent = {},
	RawInfo = {},
	PluginEditors = {};

var Images = [],
	$table = null,
	$torrentForm = null,
	n$torrentForm = null,
	magnetParams = null,
	Plugins={};
// Plugins = {};

const RarbgRef = db.collection("javuser").doc("Rarbg");
const ImgPluginsRef = RarbgRef.collection("imgPlugins");
Lockr.prefix = "RARBG_";

console.log("declarations...");

