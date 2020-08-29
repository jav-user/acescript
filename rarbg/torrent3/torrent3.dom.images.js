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
