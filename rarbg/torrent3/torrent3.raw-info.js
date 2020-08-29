
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

