class ndate {
	constructor(date) {
		this.date = date ? new Date(date) : new Date();
	}
	moment(mt) {
		var str = mt.format("YYYY-MM-DD HH:mm:ss");
		this.date = new Date(mt);
		return this;
	}
	timeZone() {
		return new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
	}
}
