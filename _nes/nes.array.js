class narray {
	constructor(arr) {
		this.arr = arr;
	}

	capitalize() {
		this.arr = this.arr.map((el) =>
			new nstring(el + "").capitalize().exec()
		);

		return this;
	}

	clear() {
		this.arr = this.arr.filter((el) => el != "");
		return this;
	}

	lower() {
		this.arr = this.arr.filter((el) => el.toLowerCase());
		return this;
	}
	merge(arr) {
		arr.forEach((el) => {
			this.arr.push(el);
		});
		return this;
	}
	push(arr) {
		var vm = this;
		if (!Array.isArray(arr)) {
			arr = [arr];
		}
		arr.forEach((el) => {
			vm.arr.push(el);
		});
		return vm;
	}
	pushData(data) {
		for (var key in data) {
			if (data[key]) this.arr.push(key);
		}
		return this;
	}
	randomize() {
		this.arr = this.arr.sort(() => 0.5 - Math.random());
		return this;
	}
	trim() {
		this.arr = this.arr.map((el) => el.trim());
		return this;
	}
	unique() {
		this.arr = this.arr.filter((el, i, arr) => arr.indexOf(el) == i);
		return this;
	}

	upper() {
		this.arr = this.arr.map((el) => el.toUpperCase());
		return this;
	}

	exec() {
		return this.arr;
	}
}
