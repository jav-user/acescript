const getTableData = () => {
	var $trs = $table.children("tbody").children("tr");
	$trs.each((i, tr) => {
		var $tds = $(tr).children("td");
		var key = $tds.eq(0).text().toLowerCase().replace(/[:]/g, "").trim();
		var val = {
			text: $tds.eq(1).text().replace(/[\n]/g, ""),
			html: `<div>${$tds.eq(1).html()}</div>`,
			$: $tds.eq(1),
		};
		TableData[key] = val;
	});
	return TableData;
};

getTableData();

const getImages = () => {
	if (!TableData["description"]) return false;
	var $d = TableData["description"].$;
	var $imgs = $d.find("img");
	$imgs.each((i, img) => {
		var image = {
			html: img,
			$: $imgs.eq(i),
			thumbnail: img.src,
			thumbnailSrc: new URL(img.src),
			src: img.src,
			href: $(img).parents("a:first").prop("href"),
		};
		const id = CryptoJS.MD5(image.thumbnail).toString();
		Images[id] = image;
	});
	// console.log($imgs)
};
getImages();
const getTorrentInfo = () => {
	var Magnet = new ntorrent(TableData.torrent.$[0]).getMagnets()[0];
	Torrent.size = TableData.size.text;
	// Torrent.images = Images.map((Img) => Img.url);
	Torrent.images = Images;
	// Torrent.imagesArr = [];
	// for (var id in Images) {
	// 	const image = {
	// 		id: id,
	// 		thumbnail: Images[id].thumbnail,
	// 		url: Images[id].thumbnail,
	// 	};
	// 	Torrent.images[id] = image;
	// 	Torrent.imagesArr.push(image);
	// }
	// Torrent.name = Magnet.name;
	// Torrent.hash = Magnet.hash;
	// Torrent.magnetUrl = Magnet.url;
	// Torrent.trackers = 	Magnet.trackers;
	Torrent.magnet = Magnet;
	// Torrent.magnet = Magnet;
	Torrent.title = TableData.torrent.text.trim();
	Torrent.poster = TableData.poster.$.find("img").attr("src");
	Torrent.hash = Magnet.params.get("xt");

	Torrent.category = getCategory();

	if (Torrent.category.id == 4) {
		Torrent.studio = getStudio();
		Torrent.stars = getStars().join(", ");
	}
};

getTorrentInfo();

function getCategory() {
	const $a = TableData.category.$.find("a");
	var url = $a.prop("href");
	var name = $a.text();
	var search = new URL(url).search;
	var params = new URLSearchParams(search);
	var id = params.get("category");
	return {
		id: id,
		url: url,
		name: name,
	};
}

function getCategories() {
	var categories = Array.from(TableData.category.$.find("a"))
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
