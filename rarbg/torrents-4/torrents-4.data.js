$tableTr.each((i, tr) => {
	const $td = $(tr).children("td");
	const $f = {};
	$f.$row = $(tr);
	$f.$category = $td.eq(0);
	$f.$file = $td.eq(1);
	$f.$name = $f.$file.find("a");
	$f.$added = $td.eq(2);
	$f.$size = $td.eq(3);
	$f.$seeders = $td.eq(4);
	$f.$leechers = $td.eq(5);
	$f.$uploader = $td.eq(7);

	const url = $f.$name.prop("href");
	const name = $f.$name.text();
	const id = CryptoJS.MD5(url).toString();
	var added = getDate($f.$added);
	var thumbnail = getThumbnail($f.$file.find("a"));
	var poster = getPoster(thumbnail);
	var filename = new nstring(name).validFN().exec();
	var words = new narray(
		filename.split(/[\[\]\.\- ]/).map((word) => word.toUpperCase())
	)
		.trim()
		.unique()
		.clear()
		.exec();
	// .sort();
	// console.log("words", words);
	var uploader = $f.$uploader.text();
	var uploaderID = CryptoJS.MD5(uploader).toString();
	const File = {
		categoryID: getCategoryID($f.$category),
		categoryUrl: $f.$category.find("a").prop("href"),
		updated: Date.now(),
		updatedstr: new Date().toString(),
		name: name,
		keywords: words,
		filename: new nstring(name).validFN().exec(),
		size: $f.$size.text(),
		bytes: new nstring($f.$size.text()).fileSize(),
		seeders: parseInt($f.$seeders.text()),
		leechers: parseInt($f.$leechers.text()),
		url: url,
		uploaded: added,
		uploadedStr: new Date(added).toString(),
		uploader: uploader,
		uploaderID: uploaderID,
		thumbnail: thumbnail,
		poster: poster,
		source: window.location.href,
	};
	Files[id] = File;
	$Files[id] = $f;
	Uploaders[uploaderID] = {
		name: uploader,
		updated: Date.now(),
		source: window.location.href,
	};
	// console.log(id, File);
	// formatDOM();
});

// console.log(Files);

function getDate($added) {
	var mtBerlin = moment.tz($added.text(), "Europe/Berlin");
	var mt = mtBerlin.clone().tz(new ndate().timeZone());
	return mt.valueOf();
}

function getCategoryID($category) {
	var href = $category.find("a").prop("href");
	var params = new nurl(href).getParams();
	return params.get("category");
}

function getThumbnail($title) {
	if (!$title[0].onmouseover) return null;
	var f = $title[0].onmouseover.toString();

	var match = `${f}`.match(/<img src=.*>/);

	if (!match) return false;

	var img = match[0].replaceAll("\\", "");

	var $img = $(img);
	var thumbnail = $img.attr("src");
	return thumbnail;
}

function getPoster(thumbnail) {
	if (!thumbnail) return null;
	var path = new URL(thumbnail).pathname;

	var so_char = path.split("/")[2] ? path.split("/")[3].charAt(0) : "";

	var poster = thumbnail;
	poster = thumbnail
		.replace("/static/over/", `/posters2/${so_char}/`)
		.replace("/over_opt.", "/poster_opt.")
		.replace("_small.", "_banner_optimized.");

	return poster;
}
