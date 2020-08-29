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
class nmath {
	// constructor() {}
	randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}
class nstring {
	constructor(str) {
		this.val = str;
	}
	capitalize() {
		this.val = this.val
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.substr(1))
			.join(" ");

		return this;
	}

	copy() {
		var tempInput = document.createElement("textarea");
		tempInput.value = this.val;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);
		return true;
	}

	fileSize(_type) {
		var fileSizeRx =
			"[0-9]{1,}[.]{0,1}[0-9]{0,}[ ]{0,}[ ]{0,}[kmg]{0,1}[i]{0,1}[b]";
		var str = this.val.trim().toLowerCase();
		str = str.replace("bytes", "b");

		var match = "^" + fileSizeRx + "$";
		if (!str.match(match)) return false;

		var num = str.match(/^[0-9]{1,}[.]{0,1}[0-9]{0,}/)[0];
		num = Number.parseFloat(num);

		var type = str.match(/[kmg]{0,1}[i]{0,1}[b]$/)[0].replace("i", "");

		var types = {
			b: 1,
			kb: Math.pow(10, 3),
			mb: Math.pow(10, 6),
			gb: Math.pow(10, 9),
		};

		if (!_type) return num * types[type];

		return (num * types[type]) / types[_type.toLowerCase()];
	}

	lower() {
		this.val = this.val.toLowerCase();
		return this;
	}

	upper() {
		this.val = this.val.toUpperCase();
		return this;
	}

	upperCount() {
		var i = 0;
		this.val.forEach((ch) => {
			if (ch.toUpperCase() == ch) i++;
		});
		return i;
	}
	splitAll() {
		this.val = this.val.split(/[-., ]/);
		return this.val;
	}
	splitUpper() {
		this.val = this.val.split(/(?=[A-Z])/);
		return this.val;
	}

	validFN() {
		this.val = this.val
			.replace(/[?]/g, "_")
			.replace(/[:]/g, "-")
			.replace(/[;]/g, ",")
			.replace(/[*]/g, "")
			.replace(/[/]/g, "-")
			.replace(/[\\]/g, "-")
			.replace(/[{]/g, "[")
			.replace(/[}]/g, "]")
			.replace(/["]/g, "'")
			.replace(/[>]/g, "]")
			.replace(/[<]/g, "[")
			.replace(/[|]/g, "-");
		return this;
	}
	exec() {
		return this.val;
	}
}
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
			var Url = new URL(magnet);
			var params = new URLSearchParams(url.search);
			// var name = params.get("dn");
			var Magnet = {
				url: Url.href,
				search: Url.search,
				Url: Url,
				params: params,
				name: params.get("dn"),
				hash: params.get("xt"),
				trackers: params.getAll("tr"),
			};
			Magnets.push(Magnet);
		});
		this.Magnets = Magnets;
		return this.Magnets;
	}
}
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
class n$dom {
	constructor($el) {
		this.$el = $el;
	}
	addClass(classes, strict) {
		// data = data || {};
		if (typeof classes == "string" || Array.isArray(classes)) {
			this.$el.addClass(classes);
			return this;
		}

		if (typeof classes == "object") {
			var add = [];
			var remove = [];
			for (var k in classes) {
				if (classes[k]) {
					add.push(k);
				} else {
					remove.push(k);
				}
			}
			this.$el.addClass(add);
			if (strict) this.$el.removeClass(remove);
		}

		return this;
	}
}
class n$form extends n$dom {
	constructor($el) {
		super($el);
		this.$el = $el;
	}
	data(data) {
		var vm = this;
		vm.data = data;
		vm.$el.find("input").val(function () {
			return vm.data[this.name];
		});
		return vm;
	}
	default(data) {
		var vm = this;
		vm.data = data || vm.data;

		vm.$el.find("input").each((i, input) => {
			var val = vm.data[input.name];
			var $btn = vm.$el.find(
				`button[type=button][ndefault-${input.name}]`
			);
			// console.log($btn[0], input, val, input.name);
			$btn.on("click", function () {
				$(input).val(val).trigger("change");
			});
		});
		return this;
	}

	submit(submit) {
		var vm = this;
		vm.$el.on("submit", function (e) {
			e.preventDefault();
			if (submit) submit(vm.$el);
		});
		return this;
	}
	$submit() {
		return this.$el.find("[type=submit]:focus");
	}
	getParams() {
		var vm = this;
		var params = vm.$el.serialize();
		return new URLSearchParams(params);
	}
	toggle(show) {
		var vm = this;
		vm.$el.find("[ntoggle]").toggle(show);
		console.log("$ntoggle", vm.$el.find("[ntoggle]"));
		vm.$el
			.find("button[type=button][ntoggle-btn]")
			.on("click", function () {
				console.log("toggling...");
				vm.$el.find("[ntoggle]").toggle();
			});
		return vm;
	}
	toggleNull(parentq) {
		this.$el.find("input").each((i, input) => {
			var $input = $(input);
			if (!$input.val().trim()) {
				$input.parents(parentq).attr("ntoggle", true);
			}
		});
		return this;
	}
	$elements(data) {
		var vm = this;
		for (var query in data) {
			var val = data[query];
			var $el = vm.$el.find(query);
			$el.on(val.evt, function () {
				val.f(this);
			});
		}
		return vm;
	}
	$event(query, evts, callback, data) {
		if (typeof evts == "string") evts = [evts];
		var vm = this;
		evts.forEach((evt) => {
			vm.$el.find(query).on(evt, callback);
		});
		return vm;
	}
}
class n$img {
	constructor($img) {
		this.$img = $img;
		// this.opt = options;
	}
	watchLoad(opt) {
		var vm = this;
		// let $imgs = vm.$el.find(`img[${opt.attr || "src"}]`);
		let img404 = opt.img404 || "https://i.imgur.com/YHggeAI.png";
		let onLoad = opt.onLoad;
		let onError = opt.onError;
		let load = opt.load || "nload";
		let error = opt.error || "nerror";
		vm.$img
			.on("error", function () {
				$(this).attr("src", img404);
				$(this).attr(error, true).removeAttr(load);
				if (onError) onError(this);
			})
			.on("load", function () {
				var url = $(this).attr("src");

				// console.log()
				if (url != img404) {
					$(this).attr(load, true).removeAttr(error);
					if (onLoad) onLoad(this);
				}
				// else {
				// 	$(this).attr(error, true).removeAttr(load);
				// 	if (onError) onError(this);
				// }
			});
		return vm;
	}
	error() {
		return "https://i.imgur.com/YHggeAI.png";
	}
	exec() {
		return this.$img;
	}
}
class n$input {
	constructor($input) {
		this.$input = $input; 
	}

	autoSize() {
		this.$input.each((i, input) => {
			var size = $(input).attr("size");
			$(input).attr("nsize", size || "");
		});
		this.$input.on("keyup", function () {
			var size = $(this).val().trim().length;
			$(this).attr("size", size);
		});
		this.$input.on("focus", function () {
			$(this).trigger("keyup");
		});

		this.$input.on("blur", function () {
			var nsize = $(this).attr("nsize");
			$(this).attr("size", nsize);
		});

		return this;
	}

	exec() {
		return this.$input;
	}
}
