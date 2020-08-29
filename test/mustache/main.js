var view = {
	title: "Joe",
	calc: function () {
		return 2 + 4;
	},
};

var output = Mustache.render(`<div>{{title}} spends {{calc}}</div>`, view);
// console.log(output);
// function renderHello() {
// 	// var template = $("#template").html();
// 	var rendered = Mustache.render($("#template").html(), { name: "Luke" });
// 	$("#target").html(rendered);
// }

function renderWelcome() {
	fetch("tmpl/welcome.html")
		.then((response) => response.text())
		.then((template) => {
			var rendered = Mustache.render(template, { name: "Luke" });
			document.getElementById("target").innerHTML = rendered;
		});
}
