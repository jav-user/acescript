function formatDom() {
	for (var id in $Files) {
		const $File = $Files[id];
		const File = Files[id];
		$File.$row.attr("id", "file-" + id);
		$File.$category.html(
			$(`<center>
					<a 
						href="${File.poster}" 
						target="_blank" >
						<img 
							class="nthumbnail" 
							src="${File.thumbnail || new n$img().error()}" 
							onmouseover="this.src='${File.poster || new n$img().error()}'"/>
					</a>
					<br/>
					<a 
						target="_blank" 
						href="${File.categoryUrl}">${File.categoryID}
					</a>
				</center>`)
		);

		// $File.$added.html($())
		addedDom($File.$added);

		// var classes = getClass({
		// 	name: File.name.text(),
		// 	bytes: File.bytes,
		// 	categoryID: File.categoryID,
		// });
		var classes = getClass(File);
		$File.$name.addClass(classes);
		$File.$size.addClass(classes);
		File.classes = classes;

		fileDom($File, File);
	}
}

formatDom();

function addedDom($added) {
	var mtBerlin = moment.tz($added.text(), "Europe/Berlin");
	var mt = mtBerlin.clone().tz(new ndate().timeZone());
	var str = mt.format("YYYY-MM-DD hh:mm:ss a");
	var ago = mt.fromNow();
	var now = moment();
	var minutes = now.diff(mt, "minutes");
	var hours = now.diff(mt, "hours");
	var days = now.diff(mt, "days");
	var months = now.diff(mt, "months");
	var years = now.diff(mt, "years");
	var classes = {
		"nless-10-minutes": minutes <= 10,
		"nless-1-hour": hours < 1,
		"nless-1-day": days < 1,
		"nless-1-month": months < 1,
		"nless-1-year": years < 1,
		"nmore-5-years": years > 5,
	};

	for (var k in classes) {
		if (classes[k]) {
			$added.addClass(k);
			break;
		}
	}

	$added.attr("title", str);
	$added.text(ago);
}

function getClass(data) {
	var classes = [];
	var season = data.name.match(/.S[0-9]{2}\./);
	var episode = data.name.match(/.S[0-9]{2}E[0-9]{2}\./);
	var ion10 = data.name.match(/ION10/);
	var imageset = data.name.toLowerCase().match(/imageset/);
	var GB1 = new nstring("1GB").fileSize();
	var GB2 = new nstring("3GB").fileSize();
	var GB3 = new nstring("3GB").fileSize();
	var GB3_5 = new nstring("3.5GB").fileSize();
	var GB4 = new nstring("4GB").fileSize();
	var GB5 = new nstring("5GB").fileSize();
	var GB10 = new nstring("10GB").fileSize();
	var adult = data.categoryID == 4;
	var movie =
		["14", "17", "44", "45", "48", "51", "54"].indexOf(data.categoryID) >
		-1;
	// console.log("nmovie", movie);
	var nclasses = new narray(classes).pushData({
		nfile: true,
		nimageset: imageset,
		nadult: adult && !imageset,
		"nadult-not": !adult,
		nseason: season && !adult,
		nepisode: episode && !adult,
		nion10: ion10 && !adult,
		nmovie: movie,
		"nless-1gb": data.bytes < GB1,
		"nless-2gb": data.bytes < GB2,
		"nless-3gb": data.bytes < GB3,
		"nless-3_5gb": data.bytes < GB3_5,
		"nless-4gb": data.bytes < GB4,
		"nless-5gb": data.bytes < GB5,
		"nless-10gb": data.bytes < GB10,
	});

	return classes;
}

function fileDom($File, File) {
	const $file = $File.$file;
	var $name = $file.find("a").eq(0);
	$name.text($name.text() + ` [${File.size}]`);

	hoverImage($File, File);
	var href = $name.prop("href");
	// console.log("search", SEARCH);
	var url = new nurl(href).setParam("search", SEARCH || "").toString();
	$name.prop("href", url);
}

function hoverImage($File, File) {
	var thumbnail = File.thumbnail;
	if (!thumbnail) return false;
	var poster = File.poster;
	var el = $File.$name[0];

	function hoverFn() {
		// $File.$category
		// .find("img")
		// .hide()
		// .attr("src", File.poster || new n$img().error())
		// .fadeIn(1000);
		if (!swPoster) posterAll();
		// console.log("overlib....")
		return overlib(
			`<img 
				style="max-height:500px" 
				src="${poster}" 
				border=0 
				onerror="this.src='${thumbnail}'"/>`
		);
	}

	el.onmouseover = hoverFn;

	$File.$category.find("img")[0].onmouseover = hoverFn;
}
function posterAll() {
	for (var id in $Files) {
		$Files[id].$category
			.find("img:not(.poster)")
			.attr("src", Files[id].poster || new n$img().error())
			.addClass("poster");
	}
	console.log("posterall...");
	swPoster = true;
}
