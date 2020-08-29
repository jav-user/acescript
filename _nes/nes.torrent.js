class ntorrent {
	constructor(el) {
		this.el = el;
		//this.setMagnets();
	}
	// getMagnets() {
	// return this.Magnets;
	// }
	getMagnets() {
		if (this.Magnets) return this.Magnets;

		var magnets = Array.from(this.el.querySelectorAll("a"))
			.filter((a) => a.href.startsWith("magnet:"))
			.map((a) => a.href);
		var Magnets = [];
		magnets.forEach((magnet) => {
			var url = new URL(magnet);
			var params = new URLSearchParams(url.search);
			// var name = params.get("dn");
			var Magnet = {
				url: url,
				params: params,
				name: params.get("dn"),
				hash: params.get("xt"),
			};
			Magnets.push(Magnet);
		});
		this.Magnets = Magnets;
		return this.Magnets;
	}
}
