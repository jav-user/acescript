const getMagnets = () => {
	var magnets = Array.from(RawInfo.torrent.$.find("a"))
		.filter((a) => a.href.startsWith("magnet:"))
		.map((a) => a.href);
	var Magnets=[]
	magnets.forEach(magnet=>{
		var url = new URL(magnet);
		var params = new URLSearchParams(url.search);
		var name = magnetParams.get("dn");
		var Magnet = {
			url:url,
			params:params,
			name:name,
		}
		Magnets.push(Magnet)
	})
	
	return Magnets;
};
