class ndom {
	constructor() {
		this.nmath = new nmath();
	}
	addScript(src, id, delay) {
		if (!delay) delay = 0;
		var script = document.createElement("script");
		script.id = id;
		script.type = "text/javascript";
		script.src = src + "?var=" + this.nmath.randomBetween(100, 1000);
		var head = document.querySelector("head");
		if (!head.querySelector(`script[id=${id}]`)) {
			setTimeout(() => {
				head.appendChild(script);
				console.log("Added script " + id);
			}, delay * 1000);
		}
		return this;
	}
	addStyle(href, id, delay) {
		if (!delay) delay = 0;
		var link = document.createElement("link");
		link.id = id;
		link.rel = "stylesheet";
		link.type = "text/css";

		link.href = href + "?var=" + this.nmath.randomBetween(100, 1000);
		var head = document.querySelector("head");
		if (!head.querySelector(`link[id=${id}]`)) {
			setTimeout(() => {
				head.appendChild(link);
			}, delay * 1000);
		}
		return this;
	}

	$renderFn(fnData) {}
}
