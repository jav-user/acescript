class nurl {
	constructor(url) {
		this.Url = new URL(url);
		this.params = new URLSearchParams(this.Url.search);
	}
	getParams() {
		return this.params;
	}
	getParam(param) {
		return this.params.get(param);
	}
	setParam(param, value) {
		this.params.set(param, value);
		this.Url.search = this.params.toString();
		return this;
	}
	getUrl() {
		return this.Url;
	}
	get(tag) {
		return this.Url[tag];
	}
	toString() {
		return this.Url.href;
	}
}
