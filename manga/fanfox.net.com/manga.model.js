var chapters={};

var getChapterId = ($chapter) => {
	console.log("$chapter", $chapter);
	var name = $chapter.find(".title3").text().trim().toValidFileName();
	return name.split("-")[0].trim();
};
