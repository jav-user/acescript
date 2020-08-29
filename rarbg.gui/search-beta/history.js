const SearchRef = RarbgRef.collection("SEARCH");
const $table = $("#history tbody");
Lockr.prefix = "RARBG_HISTORY";

// function renderTable(){

// }

function populateTable() {
	// $table.hide();
	SearchRef.orderBy("lastdate", "desc")
		.get()
		.then((q) => {
			// $table.fadeIn();
			$table.empty();
			var i = 1;
			q.forEach((doc) => {
				var data = doc.data();
				// console.log(i)
				var datestr = moment(data.lastdate).format(
					"YYYY-MM-DD hh:mm:ss a"
				);

				var fromnow = moment(data.lastdate).fromNow();

				var category = getCategory(data.category);
				var flag = (data.ipdata && data.ipdata.flag) || "";
				var ip = (data.ipdata && data.ipdata.ip) || "--";
				var country = (data.ipdata && data.ipdata.country_name) || "";
				var city = (data.ipdata && data.ipdata.city) || "";
				var color1 = colorFromString(CryptoJS.MD5(ip).toString());
				// var color1 = randomcolor(doc.id);
				var color2 = invertColor(color1, true);

				var $row = $(`
				<tr data-id="${doc.id}">
					<th scope="row">${i++}</th>
					<td>${data.query.toUpperCase()}</td>
					<td>${category.toUpperCase()}</td>
					<td 
						style="color: ${color2}; background-color: ${color1}" 
						title="${datestr} ${city} - ${country} (${ip})">
						${fromnow}
						<img src="${flag}"></img>
					</td>
					<td>${data.count}</td>
					<td>${data.aproximatedResults || "--"}</td>
					<td>
						<button 
							data-id="${doc.id}" 
							class="btn btn-danger" 
							onclick="deleteSearch(this)">Delete</button>
						<a  n-show=${data.url || "none"}
							href="${data.url}"
							target="_blank" 
							class="btn btn-primary">Visit</a>
					</td>
				</tr>
				`);
				$row.find("[n-show]").each((i, el) => {
					var show = $(el).attr("n-show") != "none";
					console.log("show", show);
					$(el).toggle(show);
				});
				const n$row = new n$dom($row);
				n$row.addClass({
					"n-zero-results": !data.aproximatedResults,
					"n-adult": category == "adult",
					"n-series": category == "series",
					"n-movies": category == "movies",
				});
				$table.append($row.hide().fadeIn(1000));
			});
		});
}

function getCategory(num) {
	var categories = {
		4: "adult",
		"18,41,49": "series",
		"18;41;49": "series",
		"14,17,42,44,45,46,47,48,50,51,52,54": "movies",
	};

	return categories[num] || num;
}

function deleteSearch(el) {
	const id = $(el).attr("data-id");
	SearchRef.doc(id)
		.delete()
		.then(() => {
			$(`tr[data-id=${id}]`).fadeOut();
			// $table.hide().fadeIn()
			populateTable();
			// console.log("deleted....")
		});
}

$(document).ready(() => {
	// populateTable();
	getDataTable();
});

function getDataTable() {
	SearchRef.orderBy("lastdate", "desc")
		.get()
		.then((q) => {
			var rows = [];
			q.forEach((doc) => {
				var row = formatRow(doc.id, doc.data());
				// renderTable(data);
				rows.push(row);
			});

			if (!rows.length) {
				rows = Lockr.get("rows");
			} else {
				Lockr.set("rows", rows);
			}
			// console.log(data);
			renderTable({ rows: rows });
		});
}

function renderTable(data) {
	fetch("table/table.tmpl.html")
		.then((response) => response.text())
		.then((template) => {
			// console.log(template,data)
			var idx = 1;
			data.idx = function () {
				return idx++;
			};
			var rendered = Mustache.render(template, data);
			// console.log(rendered)
			$("#rows").html(rendered);
			var percent = new nmath(0).randomBetween(-10, 10) / 10;
			console.log("percent", percent);

			$("#rows tr:nth-child(even)").each((i, tr) => {
				var $access = $(tr).find("td").eq(1);
				var bg = $access.css("backgroundColor");
				var newbg = Color(bg).darken(0.1);

				$access.css("backgroundColor", newbg.hexString());

				// var rgb = $access.css("backgroundColor");
				// var hex = rgb2hex(rgb);
				// var lum = colorLuminance(hex, -0.1);
				// $access.css("backgroundColor", lum);
			});

			$("#rows tr td").each((i, td) => {
				var bg = $(td).css("backgroundColor");
				var color = Color(bg).dark() ? "white" : "black";
				$(td).css("color", color);
			});
		});
}

function formatRow(id, data) {
	var datestr = moment(data.lastdate).format("YYYY-MM-DD hh:mm:ss a");
	var ago = moment(data.lastdate).fromNow();
	var category = getCategory(data.category);
	var flag = (data.ipdata && data.ipdata.flag) || "";
	var ip = (data.ipdata && data.ipdata.ip) || "--";
	var country = (data.ipdata && data.ipdata.country_name) || "";
	var city = (data.ipdata && data.ipdata.city) || "";
	var color1 = colorFromString(CryptoJS.MD5(ip).toString());
	var color2 = invertColor(color1, true);

	return {
		id: id,
		query: data.query,
		category: category,
		access: ago,
		flag: flag,
		ip: ip,
		country: country,
		city: city,
		color1: color1,
		color2: color2,
		times: data.count,
		results: data.aproximatedResults,
		url: data.url,
		accessTitle: `${datestr}\n${city} - ${country}\n(${ip})`,
	};
}
