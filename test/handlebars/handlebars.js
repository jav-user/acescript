// class nhandle {
// 	constructor(data) {
// 		this.templateUrl = data.templateUrl;
// 		this.template = data.template;
// 		this.data = data.data;
// 		this.$target = data.$target;
// 	}
// 	exec() {
// 		var vm = this;
// 		if (this.templateUrl) {
// 			fetch(this.templateUrl)
// 				.then((response) => response.text())
// 				.then((html) => {
// 					var template = Handlebars.compile(html);
// 					vm.$target.html(template(vm.data));
// 				});
// 			return true;
// 		}
// 	}
// }

class nhandle {
	constructor(data) {
		this._url = data.url;
		this._html = data.html;
	}

	html() {
		var vm = this;
		if (this._html) {
			return new Promise((solve) => {
				solve(vm._html);
			});
		}

		return fetch(this._url).then((res) => {
			vm._html = res.text();
			return vm._html;
		});
	}

	template() {
		return this.html().then((html) => {
			return Handlebars.compile(html);
		});
	}
	render($el,data){
		return this.template().then(tmpl=>{
			return $el.html(tmpl(data))
		})
	}
}

function compileHello() {
	new nhandle({ url: "tmpl/hello.html", })
		.render($("#main"),{name:"Rick"})
		.then($el=>console.log($el.html()))
		// .then((tmpl) => console.log(tmpl({name:"Rick"})));
	// fetch("tmpl/hello.html")
	// 	.then((response) => response.text())
	// 	.then((tmpl) => {
	// 		var template = Handlebars.compile(tmpl);
	// 		$("#main").html(template({ name: "Jake" }));
	// 	});
	// new nhandle();
	// .fromUrl("tmpl/hello.html")
	// .then((template) => template({ name: "Jake" }));
}
