class nobj {
	constructor(obj) {
		this.obj=obj;
	}
	clone() {
		this.obj = JSON.parse(JSON.stringify(this.obj));
		return this;
	}
	exec() {
		return this.obj;
	}
}
