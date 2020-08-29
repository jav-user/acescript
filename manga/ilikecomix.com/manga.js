var chapterToCmdLines = (images, manga, chapter, webname) => {
	var lines = [];
	var host = window.location.hostname;
	var webname = server ? `${server} (${host})` : host;
	images.forEach((img, i) => {
		var pageNum = `00000000000000${i + 1}`.substr(-5);
		var url = img.replace(/^\/\//, "https://");
		lines.push(
			`nddown "${url}==${pageNum}" "${manga}/${manga} - ${chapter} (${window.location.hostname}) ${images.length}pp" "${webname}"`
		);
	});
	return lines;
};
