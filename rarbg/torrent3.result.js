//testing...
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
class n$form {
	constructor($form) {
		this.$form = $form;
	}
	data(data) {
		var vm = this;
		vm.data = data;
		vm.$form.find("input").val(function () {
			return vm.data[this.name];
		});
		return vm;
	}
	default(data) {
		var vm = this;
		vm.data = data || vm.data;

		vm.$form.find("input").each((i, input) => {
			var val = vm.data[input.name];
			var $btn = vm.$form.find(
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
		vm.$form.on("submit", function (e) {
			e.preventDefault();
			if (submit) submit(vm.$form);
		});
		return this;
	}
	$submit() {
		return this.$form.find("[type=submit]:focus");
	}
	getParams() {
		var vm = this;
		var params = vm.$form.serialize();
		return new URLSearchParams(params);
	}
	toggle(show) {
		var vm = this;
		vm.$form.find("[ntoggle]").toggle(show);
		console.log("$ntoggle", vm.$form.find("[ntoggle]"));
		vm.$form
			.find("button[type=button][ntoggle-btn]")
			.on("click", function () {
				console.log("toggling...");
				vm.$form.find("[ntoggle]").toggle();
			});
		return vm;
	}
	toggleNull(parentq) {
		this.$form.find("input").each((i, input) => {
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
			var $el = vm.$form.find(query);
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
			vm.$form.find(query).on(evt, callback);
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
// ==UserScript==
// @name RarbgTorrent
// @namespace RarbgTorrent Script
// @match *://rarbgweb.org/torrent/*
// @grant none
//// @require https://jav-user.github.io/acescript/_nes/nes.1.0.1.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
//// @require https://jav-user.github.io/scripts/rarbg/torrents.js?a=1
//// @require https://jav-user.github.io/acescript/rarbg/torrent3.result.js?a=1
// ==/UserScript==

new ndom().addStyle("https://jav-user.github.io/acescript/rarbg/torrent3.css","torrent3-css")

console.log("scripts...")



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

const pluginTpl = `
<form>
<hr/>
  <table>
    <tbody>

      <tr>
        <td>
          <button type="button" ndefault-fn>Default</button>
        </td>
        <td>
          <input nautosize type="hidden" name="host" />
          <input nautosize  name="fn" />
          <button type="submit" name="save">save</button>
        </td>
      </tr>

      <tr>
        <td>
           <button type="button" ndefault-url>Default</button>
        </td>
        <td>
          <input nautosize  name="url" />
        </td>
      </tr>

      </tbody>
    </table>
<br/>
</form>`;

const torrentFormTpl = `
    <form id="torrentForm">
    <table class="lista" >
      <tbody>
          <tr>
            <td class="header2">Actions: </td>
            <td>
                <button type="button" ntoggle-btn>toggle</button>
                <button type="submit" name="save">save</button>
            </td>
          </tr>
          <tr ntoggle>
              <td class="header2">title: </td>
              <td class="lista"><input nautosize name="title" /></td>
              <td class="lista"><button  type="button" ndefault-title>default</button></td>
          </tr>
          <tr>
              <td class="header2">name: </td>
              <td class="lista"><input nautosize name="name" /></td>
              <td class="lista"><button  type="button" ndefault-name>default</button></td>
          </tr>
          <tr ntoggle>
              <td class="header2">hash: </td>
              <td class="lista"><input nautosize disabled name="hash" /></td>
              <td class="lista"><button  type="button" ndefault-hash>default</button></td>
          </tr>
          <tr ntoggle>
              <td class="header2">magnet: </td>
              <td class="lista"><input nautosize name="magnet" /></td>
              <td class="lista"><button  type="button" ndefault-magnet>default</button></td>
          </tr>
          <tr ntoggle>
              <td class="header2">poster: </td>
              <td class="lista"><input nautosize name="poster" /></td>
              <td class="lista"><button  type="button" ndefault-poster>default</button></td>          </tr>
          <tr>
              <td class="header2">studio: </td>
              <td class="lista"><input nautosize name="studio"/></td>
              <td class="lista"><button  type="button" ndefault-studio>default</button></td>
          </tr>
          <tr>
              <td class="header2">stars: </td>
              <td class="lista"><input nautosize name="stars"/></td>
              <td class="lista"><button  type="button" ndefault-stars>default</button></td>
          </tr>
          <tr>
              <td class="header2">categories: </td>
              <td class="lista"><input nautosize name="categories" /></td>
              <td class="lista"><button  type="button" ndefault-categories>default</button></td>
          </tr>

      </tbody>
    </table>
    </form>
    <hr/>
    `;

console.log("tpl...");

const getRawInfo = () => {
	$table = $("table.lista").eq(0);
	var $trs = $table.children("tbody").children("tr");
	$trs.each((i, tr) => {
		var $tds = $(tr).children("td");
		var key = $tds.eq(0).text().toLowerCase().replace(/[:]/g, "").trim();
		var val = {
			text: $tds.eq(1).text().replace(/[\n]/g, ""),
			html: `<div>${$tds.eq(1).html()}</div>`,
			$: $tds.eq(1),
		};
		RawInfo[key] = val;
	});
	return RawInfo;
};

getRawInfo();

console.log("raw-info...")

const getImages = () => {
	var $d = RawInfo["description"].$;
	var $imgs = $d.find("img");
	$imgs.each((i, img) => {
		var image = {
			html: img,
			$: $imgs.eq(i),
			url: img.src,
			Url: new URL(img.src),
		};
		Images.push(image);
	});
	// console.log($imgs)
};

const getPlugins = () => {
	return ImgPluginsRef.get().then((q) => {
		var plugins = {};
		q.forEach((doc) => {
			var f = doc.data().f;
			if (f) plugins[doc.id] = f;
		});
		console.log("plugins....",plugins)
		$("h1").addClass("success-connection");
		if (!Object.keys(plugins).length) {
			$("h1").addClass("lost-connection");
			return Lockr.get("Plugins");
		}
		console.log("lockr-p",Lockr.get("Plugins"))
		Lockr.set("Plugins", plugins);
		return plugins;
	});
};

const createPluginHtml = (Img) => {
	// const Plugins = Lockr.get("Plugins");

	var host = Img.Url.hostname;
	var fn = Plugins[host];
	console.log(host, Plugins);

	const $plugin = $(pluginTpl);
	const n$plugin = new n$form($plugin);

	PluginEditors[host] = $plugin;
	console.log("fn", fn);
	n$plugin
		.data({
			host: host,
			fn: fn || "",
			url: Img.url,
		})
		.default()
		.$event("input[name=url]", "change", function () {
			$img.attr("src", $(this).val());
		})
		.$event("input[name=fn]", "keyup", function () {
			var host = n$plugin.getParams().get("host");
			Plugins[host] = this.value;
			console.log("replacing...", host, this.value);
			replaceImages(host);
		})
		.submit(function () {
			var params = n$plugin.getParams();
			var $submit = n$plugin.$submit();

			ImgPluginsRef.doc(params.get("host"))
				.set({ f: params.get("fn") })
				.then(() => $submit.css("color", "green"))
				.catch((err) => console.log("error", err));
		});

	new n$input($plugin.find("input")).autoSize();

	new n$img(Img.$).watchLoad({
		onLoad: function (el) {
			console.log("load....", el);
		},
		onError: function (el) {
			console.log("error...", el);
		},
	});

	return $plugin;
};

const savePlugin = (host, f) => {
	console.log(host, f);
	return ImgPluginsRef.doc(host).set({ f: f });
};

const replaceImages = (host) => {
	// const Plugins = Lockr.get("Plugins");

	Images.filter((Img) => !host || Img.Url.hostname == host).forEach((Img) => {
		const $img = Img.$;
		var host = Img.Url.hostname;
		var imgSrc = Img.Url.href;
		var newSrc = imgSrc;
		var f = Plugins[host];
		if (f) {
			try {
				newSrc = eval(f);
			} catch (err) {
				console.log(f);
			}
		}
		Img.url = newSrc;
		let replaced = imgSrc != newSrc;
		console.log("replaced", replaced);

		$img.attr("src", newSrc)
			.toggleClass("thumbnail-load", replaced)
			.toggleClass("thumbnail-error", !replaced)

			// .css({
			// 	maxWidth: replaced ? "750px" : "",
			// 	borderWidth: "3px",
			// 	borderColor: replaced ? "green" : "red",
			// })
			.parent()
			.attr({ target: "_blank" });
		if (replaced) {
			$img.parent().attr("href", newSrc);
		}

		if (!Img.$plugin) {
			Img.$plugin = createPluginHtml(Img);
			$img.parent().before(Img.$plugin);
		}

		Img.$plugin
			.find("input[name=fn]")
			.toggleClass("input-success", replaced)
			.toggleClass("input-error", !replaced);
		// .css("color", replaced ? "green" : "red");
	});
};

const processImages = () => {
	getImages();
	replaceImages();
	var $plugin = $(".plugin-html");
	new n$input($plugin.find("input")).autoSize();

	// $("img").on("error", function () {
	// 	$(this).attr("src", "https://i.imgur.com/YHggeAI.png");
	// });
};

getPlugins()
	.then((plugins) => {
		Plugins = plugins;
		console.log("Plugins", Plugins);
		processImages();
		// $("h1").addClass("success-connection");
	})
	.catch((err) => {
		Plugins = Lockr.get("Plugins");
		processImages();
		$("h1").addClass("lost-connection");
	});

console.log("imgs...");
const getTorrentInfo = () => {
  var Magnet = new ntorrent(RawInfo.torrent.$[0]).getMagnets()[0];
  Torrent.size = RawInfo.size.text;
  Torrent.images = Images.map((Img) => Img.url);
  Torrent.name = Magnet.name;
  Torrent.magnet = Magnet.url;
  Torrent.title = RawInfo.torrent.text.trim();
  Torrent.poster = RawInfo.poster.$.find("img").attr("src");
  Torrent.hash = Magnet.params.get("xt");

  Torrent.categories = getCategories().join(", ");

  if (Torrent.categories.indexOf("adult") != -1) {
    Torrent.studio = getStudio();
    Torrent.stars = getStars().join(", ");
  }
};

const createInfoForm = () => {
  // console.log(Torrent);
  $torrentForm = $(torrentFormTpl);

  $table.before($torrentForm);

  $("h1").text(Torrent.title + " [" + Torrent.size + "]");

  $torrentForm.find("input[name=poster]").on("change", function () {
    changePoster(this);
  });

  new n$form($torrentForm)
    .data(Torrent)
    .default()
    .toggleNull("tr:first")
    .toggle()
    .submit(function ($form) {
      var arr = $form.serializeArray();
      var str = $form.serialize();
      var params = new URLSearchParams(params);
      console.log(arr, params.get("name"));
    });

  new n$input($torrentForm.find("input")).autoSize();

  // new njq($torrentForm)
  // .nosubmit()
  // .autoSize()
  // .hide("hidden")
  // .value(Torrent)
  // .defaultBtn("button.btn-default[name=default-{name}]")
  //               .toggleBtn()
  //             .toggleNull("tr:first");
};

getTorrentInfo();
createInfoForm();

function changePoster(el) {
  try {
    var url = new URL(el.value);
    RawInfo.poster.$.find("img").attr("src", el.value);
    $(el).css("color", "green");
  } catch (err) {
    $(el).css("color", "red");
    console.log("err-img", err);
  }
}

function getCategories() {
  var categories = Array.from(RawInfo.category.$.find("a"))
    .map((a) => $(a).text())
    .map((cat) => {
      var c = cat.toLowerCase();
      if (c.includes("xxx")) return "adult";
      if (c.includes("episodes")) return "series";
      if (c.includes("movies")) return "movies";
      return cat;
    });
  return categories;
}

function getStars() {
  var title = Torrent.title;
  var stars = [];
  var match1 = "- [a-zA-Z,& ]{1,} [-,]{1}";
  var match2 = "[0-9]{2}.[0-9]{2}.[0-9]{2,4}.[a-zA-Z]{1,}.[a-zA-Z]{1,}";

  var star = title.match(match1);
  if (star) star = star[0].replaceAll("-", "").trim();

  if (!star) {
    star = title.match(match2);
    if (star) star = star[0].replace(/[0-9.]/g, " ").trim();
  }

  if (star && title.toLowerCase().includes("photodromm"))
    star = star.split(" ")[0] + " (Photodromm) ";

  if (star) {
    stars = star
      .split(" And ")
      .join(",")
      .split(" and ")
      .join(",")
      .split(" & ")
      .join(",")
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a != "");
  }

  return stars;
}

function getTags() {
  var tags = {
    asian: {
      starts: ["asian"],
    },
    blacked: {
      starts: ["bbc", "blacked"],
    },
    bath: {
      starts: ["bath"],
    },
    busty: {
      equals: ["busty"],
    },
    classic: {
      starts: ["classic"],
    },
    game: {
      equals: ["game", "poker"],
    },
    incest: {
      studios: ["brattysis", "puretaboo", "spyfam"],
      equals: ["bro", "sis", "step"],
      starts: ["brother", "family", "sibling", "sister"],
    },
    javu: {
      studios: [
        "1pondo",
        "bigtitstokyo",
        "caribbeancom",
        "heyzo",
        "japanhdv",
        "javhd",
      ],
      equalsEvery: [
        ["jav", "uncensored"],
        ["caribbean", "com"],
      ],
      starts: ["caribbeancom"],
    },
    lovey: { equals: ["date", "dating"] },
    massage: {
      starts: ["massage"],
    },
    mix: {
      equals: ["compilation"],
    },
    orgasm: {
      start: ["orgasm", "squirt"],
    },
    shaved: {
      equals: ["shaved"],
    },
    shower: {
      equals: ["shower"],
    },
    strip: {
      equals: ["strip"],
      starts: ["strip", "undress"],
    },
    xart: {
      studios: [
        "21naturals",
        "babes",
        "eroticax",
        "femjoy",
        "metart",
        "nfbusty",
        "nubilefilms",
        "nubiles",
        "sexart",
        "x-art",
        "vixen",
        "thewhiteboxxx",
        "tushy",
      ],
      starts: ["nubile"],
    },
    xmovie: {
      equals: ["dvdrip"],
    },
  };
}

function getStudio() {
  var studio = Torrent.title.split(".")[0].split(" - ")[0].split("Vol.")[0];

  if (studio != Torrent.name) {
    studio = studio.trim();
    if (studio == studio.toUpperCase()) {
      studio = new nstring(studio).lower().capitalize().exec();
    }
  }
  return studio;
}

console.log("dom info...");
