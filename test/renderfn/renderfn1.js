// $(".testing").remove();

// clear();

function renderFn(tmpl, fnData) {
	var $el = $("<span>" + tmpl + "</span>");

	var Params = {};

	$el.find("*").each((i, el) => {
		if ((initexp = $(el).attr("n-init"))) eval(`Params.${initexp}`);
		// console.log(Params)

		var data = $(el).data();
		// console.log("data",data)
		for (var idx in data) {
			var evt = idx.substring(1).toLowerCase();
			if (["click", "keypress", "keyup", "nchanges"].indexOf(evt) > -1) {
				if (evt == "nchanges") evt = "DOMSubtreeModified";
				var fn = data[idx];
				var fname = fnName(fn);
				var fparams = fnParams(fn);
				// console.log("fparams",fparams)
				// console.log("fparams1", fparams);
				fparams.forEach((param, i) => {
					try {
						eval(param);
					} catch (err) {
						if (param.charAt(0) == "#") {
							fparams[i] = `$el.find("${param}")`;
						} else if (Params[param]) {
							fparams[i] = Params[param];
							if (typeof fparams[i] == "string")
								fparams[i] = `"${fparams[i]}"`;
						}
					}
				});

				// console.log("fparams2", fparams);

				//var fnexp = `fnData.${fname}.bind(this,${fparams.join(",")})`;
				// var fnexp2 = `fnData.${fname}(el,${fparams.join(",")})`;
				var fnexp3 = `fnData.${fname}(event,${fparams.join(",")})`;
				console.log(fnexp3);

				// $(el).on(evt, function () {
				// 	eval(fnexp);
				// });
				// $(el).on(evt, eval(fnexp));
				$(el).on(evt, function (event) {
					eval(fnexp3);
				});
				//console.log(fname,fparams)
			}
		}
	});

	return $el;

	function fnName(fn) {
		return fn.match(/[a-zA-Z0-9]{1,}(?=\()/)[0];
	}

	function fnParams(fn) {
		return fn
			.match(/\(.*\)/)[0]
			.slice(1, -1)
			.split(",")
			.map((el) => el.trim());
	}
}

fetch("tpl.html")
	.then((res) => res.text())
	.then((tmpl) => {
		var $el = renderFn(tmpl, {
			triggerChange: triggerChange,
			// functionParams1: functionParams1,
			// functionParams2: functionParams2,
			fnKeyup: fnKeyup1,
			subtree: subtree,
		});

		$("#main").append($el);
	});

function subtree(evt, $el) {
	console.log("changes.....!!!");
	// console.log($el);
}

function fnKeyup1(evt) {
	console.log(evt);
	// console.log(evt.target.value)
}

function triggerChange(evt, $el, cl) {
	// $("#tpl").addClass(cl)
	$el.addClass(cl);
	// console.log($el);
}

function functionParams1(evt, $el, b, c, d, e, f, g) {
	// $(evt.target).trigger("change");
	$el.addClass("noloc rick").trigger("change");
	console.log("changed...");
	// console.log(
	// 	"clicked1....",
	// 	"evt",
	// 	evt,
	// 	"el",
	// 	$el.val(),
	// 	"b",
	// 	b,
	// 	"c",
	// 	c,
	// 	"d",
	// 	d,
	// 	"e",
	// 	e,
	// 	"f",
	// 	f,
	// 	"g",
	// 	g
	// );
}
function functionParams2(evt, a, b, c) {
	console.log("clicked2....", evt, a, b, c);
}
// var $el = renderFn(tmpl, {
// 	triggerChange: triggerChange,
// 	// functionParams1: functionParams1,
// 	// functionParams2: functionParams2,
// 	fnKeyup: fnKeyup1,
// 	subtree: subtree,
// });

// $("#main").append($el);
