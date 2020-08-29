// ==UserScript==
// @name imagesDown
// @namespace imagesDown

// @grant none
// @require https://jav-user.github.io/scripts/nes/nes_functions.js?a=6
// ==/UserScript==

var addScripts = function () {
	if (!$) {
		nes.addScriptOnce(nes.cdn("jquery"), "jq");
	}

	nes.addScript(
		"https://jav-user.github.io/scripts/nes/nes_functions.js",
		"nes"
	);
	nes.addScript(
		"https://jav-user.github.io/scripts/nes/nes_manga.js",
		"nesmg"
	);
	// nes.addStyle("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css","animate")
	//console.log("added jq + nes)
};

addScripts();

var url = {
	host: window.location.hostname,
	path: window.location.pathname,
	search: window.location.search,
};

var matchUrl = function (_url) {
	var url = new URL(_url);
	var vm = this;

	vm.isBlogspotArticle = (blogname) => {
		var rx = `^/[0-9]{4}/[0-1][0-9]/[a-zA-Z-]{1,}.html`;
		console.log("regexp", rx);
		return vm.isBlogspot(blogname) && url.pathname.match(new RegExp(rx));
	};
	vm.isBlogspot = (blogname) => {
		return url.hostname.endsWith(
			blogname ? blogname + ".blogspot.com" : ".blogspot.com"
		);
	};
	vm.isBlogspotMain = () => vm.isBlogspot && url.pathname == "/";
};

var match = url.host + url.path;

console.log("url", url);
console.log("match", match);

var matches = {
	blogspot: {
		photogalssexys: {
			article: `Array.from($(".separator img")).map(img=>img)`,
		},
	},
};

var createGUI = function (q) {
	q = q ? q : `Array.from($("img")).map(img=>img.src)`;
	let folder = $("title").text().toValidFileName();

	var $el = $(`
    <div class="nes-custom">
    	<hr/>
        <button id="toggle-show">Show/Hide</button> 
        <button id="get-imgs" class="nes-form">Get Images</button>
       	<hr class="nes-form"/>
       	<span class="nes-form">
        <b>Query:</b> 
        	<input id="q-imgs" type="text" value='${q}' size="${q.length}"/>
			<button id="test-imgs" class="nes-form">Test</button> 
        <br/><br/>
        <b>Folder:</b> 
        	<input id="folder" type="text" value='${folder} $pp$' size="${folder.length}"  />
        	<button id="folder-default" class="nes-form">Default</button> 
      	</span>
    </div>
`);

	$el.find("#get-imgs").on("click", function () {
		let query = $el.find("#q-imgs").val();
		let imgs = getImgsByQuery(query);
		console.log("imgs", imgs.join("\n"));
		let folder = $el.find("#folder").val().trim().toValidFileName();
		let cmd = getLines(imgs, folder);
		console.log("cmd", cmd);
		alert(`Got ${imgs.length} images!!`);
		nes.copy(cmd);
	});

	$el.find("#test-imgs").on("click", function () {
		let query = $el.find("#q-imgs").val();
		let imgs = getImgsByQuery(query);
		console.log("imgs", imgs);
		alert(`Tested ${imgs.length} images!!`);
	});

	$el.find("#folder-default").on("click", function () {
		let $folder = $el.find("#folder");
		let title = $("title").text().toValidFileName();
		$folder.val(title + " $pp$");
	});

	$el.find("#toggle-show").on("click", function () {
		$el.find(".nes-form").fadeToggle();
	});

	$el.find("input").on("keyup", function () {
		let val = $(this).val();
		$(this).prop("size", val.length || 1);
	});

	$el.find("button").css("fontWeight", "bold");
	$(".nes-custom").remove();
	$("h1").eq(0).parent().after($el.hide().fadeIn(1000));
	$el.find(".nes-form")
		//.addClass("animate__animated animate__fadeIn")
		.hide();
};

var getImgsByQuery = function (query) {
	try {
		console.log("query", query);
		var imgs = eval(query);
		return imgs;
	} catch (err) {
		alert("Error at getImgsByQuery");
		console.log("error at getImgsByQuery: ", err);
		throw err;
		return null;
	}
};

var getLines = function (imgs, folder) {
	var pp = imgs.length + "pp";
	folder = folder.replace("$pp$", pp);
	var lines = imgs.map((img, i) => {
		var num = ("00000000" + (i + 1)).substr(-5);
		let line = `${img}=${num}`;
		return `nddown "${line}" "${folder}" "${window.location.hostname}"`;
	});
	return `D:\n${lines.join("\n")}\n`;
};

$(document).ready(function () {
	setTimeout((_) => {
		var murl = new matchUrl(window.location.href);
		if (murl.isBlogspotArticle()) {
			var blogname = window.location.hostname.replace(
				".blogspot.com",
				""
			);
			var blog = matches.blogspot[blogname];
			console.log("blogname", blogname);
			createGUI(blog ? blog.article : blog);
		}
	}, 3.5 * 1000);
});
