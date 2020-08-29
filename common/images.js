var getLines = function (imgs, folder) {
	var pp = imgs.length + "pp";
	if (!folder) {
		var folder = $("title").text().toValidFileName()+" $pp$";
	}
	folder = folder.replace("$pp$", pp);
	var lines = imgs.map((img, i) => {
		var num = ("00000000" + (i + 1)).substr(-5);
		let line = `${img}=${num}`;
		return `nddown "${line}" "${folder}" "${window.location.hostname}"`;
	});
	return `D:\n${lines.join("\n")}\n`;
};
