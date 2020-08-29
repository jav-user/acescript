class narray {
	constructor(arr) {
		this.arr = arr;
	}
	trim() {
		this.arr = this.arr.map((el) => el.trim());
		return this;
	}
	clear() {
		this.arr = this.arr.filter((el) => el != "");
		return this;
	}
	merge(arr) {
		arr.forEach((el) => {
			this.arr.push(el);
		});
		return this;
	}
	unique() {
		this.arr = this.arr.filter((el, i, arr) => arr.indexOf(el) == i);
		return this;
	}
	randomize() {
		this.arr = this.arr.sort(() => 0.5 - Math.random());
		return this;
	}
	exec() {
		return this.arr;
	}
}

class nhtml {
	constructor(html) {
		this.val = html;
	}
	mustache(values, value) {
		if (!value) {
			for (var i in values) {
				this.val = this.val.replaceAll(`{{${i}}}`, values[i]);
			}
			return this;
		}

		this.val = this.val.replaceAll(`{{${values}}}`, value);
		return this;
	}

	$() {
		return $(this.val);
	}

	exec() {
		return this.val;
	}
}

class njq {
	constructor($el) {
		this.$el = $el;
		this.toggleAttr="ntoggle"
	}

	autoSize(_attr) {
		let attr = _attr || "nautosize";
		var q = `input[${attr}]`;
		var $inputs = this.$el.find(q);
		// console.log("q", q);
		// console.log("$inputs", $inputs);
		$inputs.on("keyup", function () {
			var size = $(this).val().trim().length;
			$(this).attr("size", size);
		});
		$inputs.on("focus", function () {
			$(this).trigger("keyup");
		});
		return this;
	}

	// hide(classes) {
	// 	this.hiddenClass = classes;
	// 	var query = "." + classes.split(" ").join(".");
	// 	this.hiddenQuery = query;
	// 	this.$el.find(this.hiddenQuery).hide();
	// 	return this;
	// }

	nosubmit() {
		this.$el.on("submit", function (e) {
			e.preventDefault();
		});
		return this;
	}

	value(data) {
		this.data = data;
		var vm = this;
		vm.$el
			.find("input")
			.val(function () {
				return data[this.name];
			})
			.trigger("change");
		return vm;
	}

	defaultBtn(query, data) {
		if (!data) data = this.data;
		console.log("data", data);
		var vm = this;
		for (var key in data) {
			let q = query.replace("{name}", key);

			let $btn = vm.$el.find(q);
			let $input = vm.$el.find(`input[name=${key}]`);
			let val = data[key];
			console.log(q, key, val);

			$btn.on("click", function () {
				$input.val(val).trigger("change");
				console.log("key", key);
			});
		}

		return vm;
	}

	toggleBtn(_attr) {
		let vm = this;
		let attr = _attr || this.toggleAttr;
		let ntoggle = `[${attr}]`;
		let ntogglebtn = `[${attr + "-btn"}]`;
		this.toggleAttr = attr;
		// vm.toggleClass = toggleClass;
		// let toggleQuery = "." + toggleClass.split(" ").join(".");
		// this.toggleQuery = query;
		// console.log("ntoggle", ntoggle);
		var $ntoggle = vm.$el.find(ntoggle);
		$ntoggle.toggle();
		// console.log("$ntoggle", $ntoggle);
		var $ntogglebtn = vm.$el.find(ntogglebtn);
		// console.log("$ntogglebtn", $ntogglebtn);
		$ntogglebtn.on("click", function () {
			vm.$el.find(ntoggle).toggle();
		});
		return vm;
	}

	toggleNull(parentq) {
		var vm = this;
		let attr = this.toggleAttr;
		// let ntoggle = `[${attr}]`;//
		// if (!toggleClass) toggleClass = vm.toggleClass;
		vm.$el.find("input").each((i, input) => {
			var $input = $(input);
			if (!$input.val().trim()) {
				// console.log("class", vm.toggleClass);
				$input.parents(parentq).attr(attr, true).toggle();
			}
		});
		return vm;
	}

	exec() {
		return this.$el;
	}
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
		let words = this.val.split(" ");

		this.val = this.val
			.split(" ") //words
			.map((word) => {
				if (word.trim() == "") return word; //empty
				return word.replace(word[0], word[0].toUpperCase()); //upper
			})
			.join(" ");

		return this;
	}
	lower() {
		this.val = this.val.toLowerCase();
		return this;
	}

	upper() {
		this.val = this.val.toUpperCase();
		return this;
	}

	splitUpper() {
		this.val = this.val.split(/(?=[A-Z])/);
		return this.val;
	}
	splitAll() {
		this.val = this.val.split(/[-., ]/);
		return this.val;
	}
	upperCount() {
		var i = 0;
		this.val.forEach((ch) => {
			if (ch.toUpperCase() == ch) i++;
		});
		return i;
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
}

class Nes {
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
	}

	copy(str) {
		var tempInput = document.createElement("textarea");
		tempInput.value = str;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);
		return true;
	}

	getFileSize = function (str, _type) {
		var fileSizeRx =
			"[0-9]{1,}[.]{0,1}[0-9]{0,}[ ]{0,}[ ]{0,}[kmg]{0,1}[i]{0,1}[b]";
		var str = str.trim().toLowerCase();
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
	};
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
}

class n$input {
	constructor($input) {
		this.$input = $input;
	}

	autoSize() {
		this.$input.on("keyup", function () {
			var size = $(this).val().trim().length;
			$(this).attr("size", size);
		});
		this.$input.on("focus", function () {
			$(this).trigger("keyup");
		});
		return this;
	}

	exec() {
		return this.$input;
	}
}

class n$form {
	constructor($form) {
		this.$form = $form;
	}
	defaultData(data) {
		this.data = data;
		this.$form.find("input").val(function () {
			var input = this;
			var val = data[this.name];
			var $btn = $(`button[type=button][ndefault-${this.name}]`);
			$btn.on("click", function () {
				$(input).val(val);
			});
			return val;
		});
	}
}
